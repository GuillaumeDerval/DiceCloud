<template lang="html">
  <div class="feature-form">
    <text-field
      ref="focusFirst"
      label="Name"
      :value="model.name"
      :error-messages="errors.name"
      @change="change('name', ...arguments)"
    />
    <v-layout
      column
      align-center
    >
      <v-radio-group
        :value="radioSelection"
        @change="radioChange"
      >
        <v-radio
          value="enabled"
          label="Enabled"
        />
        <v-radio
          value="disabled"
          label="Disabled"
        />
        <v-radio
          value="calculated"
          label="Calculated"
        />
      </v-radio-group>
    </v-layout>
    <v-fade-transition>
      <text-field
        v-show="radioSelection === 'calculated'"
        label="Condition"
        hint="When this calculation returns a value that isn't false or zero the children will be active"
        :value="model.condition"
        :error-messages="errors.condition"
        @change="change('condition', ...arguments)"
      />
    </v-fade-transition>
    <calculation-error-list :errors="model.errors" />
    <smart-combobox
      label="Tags"
      multiple
      chips
      deletable-chips
      hint="Used to let slots find this property in a library, should otherwise be left blank"
      :value="model.tags"
      @change="change('tags', ...arguments)"
    />
  </div>
</template>

<script lang="js">
  import propertyFormMixin from '/imports/ui/properties/forms/shared/propertyFormMixin.js';
  import CalculationErrorList from '/imports/ui/properties/forms/shared/CalculationErrorList.vue';

	export default {
    components: {
      CalculationErrorList,
    },
    mixins: [propertyFormMixin],
    computed: {
      radioSelection(){
        if (this.model.disabled){
          return 'disabled';
        } else if (this.model.enabled){
          return 'enabled'
        } else {
          return 'calculated';
        }
      }
    },
    methods: {
      radioChange(value){
        if (value === 'enabled'){
          this.$emit('change', {path: ['enabled'], value: true});
          this.$emit('change', {path: ['disabled'], value: false});
        } else if (value === 'disabled'){
          this.$emit('change', {path: ['disabled'], value: true});
          this.$emit('change', {path: ['enabled'], value: false});
        } else if (value === 'calculated'){
          this.$emit('change', {path: ['disabled'], value: false});
          this.$emit('change', {path: ['enabled'], value: false});
        }
      }
    }
	};
</script>

<style lang="css" scoped>
</style>
