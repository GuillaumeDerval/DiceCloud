<template lang="html">
  <div class="feature-form">
    <text-field
      ref="focusFirst"
      label="Name"
      :value="model.name"
      :error-messages="errors.name"
      @change="change('name', ...arguments)"
    />
    <text-area
      label="Summary"
      hint="This will appear in the feature card in the character sheet"
      :value="model.summary"
      :error-messages="errors.summary"
      @change="change('summary', ...arguments)"
    />
    <calculation-error-list :calculations="model.summaryCalculations" />

    <text-area
      label="Description"
      hint="The rest of the description that doesn't fit in the summary goes here"
      :value="model.description"
      :error-messages="errors.description"
      @change="change('description', ...arguments)"
    />
    <calculation-error-list :calculations="model.descriptionCalculations" />

    <smart-combobox
      label="Tags"
      multiple
      chips
      deletable-chips
      hint="Used to let slots find this property in a library, should otherwise be left blank"
      :value="model.tags"
      :error-messages="errors.tags"
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
		data(){ return{
			enabledOptions: [
				{
					text: 'Always enabled',
					value: 'always',
				}, {
					text: 'Enabled',
					value: 'enabled',
				}, {
					text: 'Disabled',
					value: 'disabled',
				}
			],
		}},
		computed: {
			enabledStatus(){
				if (!this.model) return;
				if (this.model.alwaysEnabled) return 'always';
				if (this.model.enabled) return 'enabled';
				return 'disabled';
			},
		},
		methods: {
			changeEnabled(value, ack){
				let change = ({enabled, alwaysEnabled}) => {
					this.$emit('change', {path: ['enabled'], value: enabled, ack});
					this.$emit('change', {path: ['alwaysEnabled'], value: alwaysEnabled, ack});
				}
				if (value === 'always'){
					change({enabled: true, alwaysEnabled: true});
				} else if (value === 'enabled'){
					change({enabled: true, alwaysEnabled: false});
				} else if (value === 'disabled'){
					change({enabled: false, alwaysEnabled: false});
				}
			},
		},
	};
</script>

<style lang="css" scoped>
</style>
