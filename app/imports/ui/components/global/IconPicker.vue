<template lang="html">
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="slide-y-transition"
    min-width="290px"
    style="overflow-y: auto;"
  >
    <template #activator="{ on }">
      <div class="layout align-center">
        <v-label>{{ label }}</v-label>
        <v-btn
          :loading="loading"
          large
          icon
          v-on="on"
        >
          <svg-icon
            v-if="safeValue && safeValue.shape"
            large
            :shape="safeValue.shape"
          />
          <v-icon
            v-else
            large
          >
            mdi-select-search
          </v-icon>
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-card-text>
        <div class="layout row align-center">
          <text-field
            ref="iconSearchField"
            label="Search icons"
            append-icon="mdi-magnify"
            clearable
            hide-details
            class="ma-2"
            :value="searchString"
            @change="search"
          />
          <v-btn
            text
            @click="select()"
          >
            clear
          </v-btn>
        </div>
        <v-layout
          wrap
          style="max-height: 400px; overflow-y: auto;"
        >
          <v-scale-transition
            group
            hide-on-leave
          >
            <v-btn
              v-for="icon in icons"
              :key="icon._id"
              icon
              large
              @click="select(icon)"
            >
              <svg-icon
                :shape="icon.shape"
                x-large
              />
            </v-btn>
          </v-scale-transition>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="js">
import SvgIcon from '/imports/ui/components/global/SvgIcon.vue';
import SmartInput from '/imports/ui/components/global/SmartInputMixin.js';
import { findIcons } from '/imports/api/icons/Icons.js';

export default {
  components: {
    SvgIcon,
  },
  mixins: [SmartInput],
	props: {
    label: {
      type: String,
      default: 'Icon',
    },
	},
	data(){return {
		menu: false,
    searchString: '',
    icons: [],
	};},
  watch: {
    menu(value){
      if (value){
        setTimeout(() => {
          if (this.$refs.iconSearchField){
            this.$refs.iconSearchField.$children[0].focus();
          }
        }, 100);
      }
    },
  },
	methods: {
    search(value, ack){
      this.searchString = value;
      this.icons = [];
      findIcons.call({search: value}, (error, result) => {
        ack(error);
        this.icons = result;
      });
    },
    select(icon){
      this.menu = false;
      this.change(icon);
    },
	},
}
</script>

<style lang="css" scoped>
</style>
