<template lang="html">
  <v-speed-dial
    v-if="speedDials"
    v-model="fab"
    direction="bottom"
  >
    <template #activator>
      <v-btn
        v-model="fab"
        color="primary"
        fab
        data-id="insert-creature-property-fab"
        class="insert-creature-property-fab"
        small
      >
        <transition
          name="fab-rotate"
        >
          <v-icon
            style="transition: transform 0.2s ease-in-out"
            :style="fab && 'transform: rotate(45deg)'"
          >
            mdi-plus
          </v-icon>
        </transition>
      </v-btn>
    </template>

    <labeled-fab
      v-for="type in speedDials"
      :key="type"
      color="primary"
      :data-id="`insert-creature-property-type-${type}`"
      :label="type ? 'New ' + properties[type].name : 'New Property'"
      :icon="type ? properties[type].icon : 'mdi-plus'"
      :disabled="!editPermission"
      @click="addProperty(type)"
    />
  </v-speed-dial>
</template>

<script lang="js">
  import LabeledFab from '/imports/ui/components/LabeledFab.vue';
  import { getHighestOrder } from '/imports/api/parenting/order.js';
  import insertProperty from '/imports/api/creature/creatureProperties/methods/insertProperty.js';
  import CreatureProperties from '/imports/api/creature/creatureProperties/CreatureProperties.js';
  import PROPERTIES from '/imports/constants/PROPERTIES.js';
  import insertPropertyFromLibraryNode from '/imports/api/creature/creatureProperties/methods/insertPropertyFromLibraryNode.js';
  import fetchDocByRef from '/imports/api/parenting/fetchDocByRef.js';

  function getParentAndOrderFromSelectedTreeNode(creatureId){
    // find the parent based on the currently selected property
    let el = document.querySelector('.tree-tab .tree-node-title.primary--text');
    let selectedComponent = el && el.parentElement.__vue__.$parent;
    let parentRef, order;
    if (selectedComponent){
      if (selectedComponent.showExpanded){
        parentRef = {
          id: selectedComponent.node._id,
          collection: 'creatureProperties',
        };
        order = getHighestOrder({
          collection: CreatureProperties,
          ancestorId: parentRef.id,
        }) + 0.5;
      } else {
        parentRef = selectedComponent.node.parent;
        order = selectedComponent.node.order + 0.5;
      }
    } else {
      parentRef = {collection: 'creatures', id: creatureId};
      order = getHighestOrder({
        collection: CreatureProperties,
        ancestorId: parentRef.id,
      }) + 0.5;
    }
    return {parentRef, order}
  }

  function hideFab(){
    let fab = document.querySelector('.insert-creature-property-fab');
    if (fab) fab.style.opacity = '0';
    return fab;
  }

  function revealFab(fab){
    if (!fab) return;
    // Bring back the fab with scale up animation
    fab.style.transition = 'none';
    fab.style.opacity = '';
    fab.style.transform = 'scale(0)';
    setTimeout(()=> {
      fab.style.transform = '';
      fab.style.transition = '';
    }, 400);
  }

  const tabs = [
    'stats',
    'features',
    'inventory',
    'spells',
    'character',
    'tree',
  ];

  export default {
    components: {
      LabeledFab,
    },
    props: {
      editPermission: Boolean,
    },
    data(){return {
      fab: false,
    };},
    computed: {
      creatureId(){
        return this.$route.params.id;
      },
      tabNumber(){
        return this.$store.getters.tabById(this.creatureId);
      },
      speedDials(){
        return this.speedDialsByTab[tabs[this.tabNumber]];
      },
      speedDialsByTab() { return {
        'stats': ['attribute', 'skill', 'action', 'attack'],
        'features': ['feature'],
        'inventory': ['item', 'container'],
        'spells': ['spellList', 'spell'],
        'character': ['note'],
        'tree': [null],
      };},
      properties(){
        return PROPERTIES;
      },
    },
    methods: {
      addProperty(forcedType){
        let creatureId = this.creatureId;
        let fab = hideFab();

        let {parentRef, order } = getParentAndOrderFromSelectedTreeNode(creatureId);
        let parent;
        try {
          parent = fetchDocByRef(parentRef);
        } catch (e) {
          console.warn(e);
        }

        this.$store.commit('pushDialogStack', {
          component: 'add-creature-property-dialog',
          elementId: 'insert-creature-property-type-' + forcedType,
          data: {
            parentDoc: forcedType ? undefined : parent,
            forcedType,
          },
          callback(result){
            if (!result){
              return 'insert-creature-property-fab';
            }
            if (Array.isArray(result)){
              revealFab(fab);
              let nodeIds = result;
              let id = insertPropertyFromLibraryNode.call({nodeIds, parentRef, order});
              return forcedType ? id : `tree-node-${id}`;
            } else {
              revealFab(fab);
              let creatureProperty = result;
              // Get order and parent
              creatureProperty.order = order;
              // Insert the property
              let id = insertProperty.call({creatureProperty, parentRef});
              return forcedType ? id : `tree-node-${id}`;
            }
          }
        });
      },
    }
  }
</script>

<style lang="css" scoped>
  .insert-creature-property-fab {
    transition: transform 0.07s cubic-bezier(0.5, 0.2, 0.8, 0.4) 0s;
  }
</style>
