<template lang="html">
  <div>
    <div class="layout wrap">
      <text-field
        label="Name"
        :value="model.name"
        :error-messages="errors.name"
        @change="change('name', ...arguments)"
      />
      <text-field
        label="Variable name"
        :value="model.variableName"
        style="flex-basis: 300px;"
        hint="Use this name in calculations to reference this attribute"
        :error-messages="errors.variableName"
        @change="change('variableName', ...arguments)"
      />
    </div>
    <text-field
      label="Value"
      hint="Calculation of the constant value, use 'text' for a string value, [1,2,3] for a matrix, or 123 for a number"
      :value="model.calculation"
      :error-messages="errors.calculation"
      @change="change('calculation', ...arguments)"
    />
    <calculation-error-list :errors="clientErrors" />
  </div>
</template>

<script lang="js">
import propertyFormMixin from '/imports/ui/properties/forms/shared/propertyFormMixin.js';
import CalculationErrorList from '/imports/ui/properties/forms/shared/CalculationErrorList.vue';
import { ConstantSchema } from '/imports/api/properties/Constants.js';

export default {
  components: {
    CalculationErrorList,
  },
  mixins: [propertyFormMixin],
  computed: {
    // We can't rely on autoValue running in every form, so recalculate errors
    clientErrors(){
      let cleanModel = ConstantSchema.clean(this.model);
      return cleanModel.errors;
    }
  }
}
</script>

<style lang="css" scoped>
</style>
