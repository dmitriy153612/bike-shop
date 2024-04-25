<template>
  <div class="option-descr">
    <span class="option-descr__name">{{ optionName }}: </span>
    <span class="option-descr__value" :class="{ 'option-descr__value--red': redValue }">
      {{ formattedOptionValue }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import formatCurrency from '@/helpers/formatCurrency'
import { computed } from 'vue'

const props = defineProps({
  optionName: { type: String, required: true },
  optionValue: { type: [String, Number], required: true },
  currency: { type: Boolean, default: false },
  negative: { type: Boolean, default: false },
  redValue: { type: Boolean, default: false }
})
const formattedOptionValue = computed(() => {
  if (typeof Number(props.optionValue) === 'number' && props.currency) {
    const value = formatCurrency(props.optionValue)
    return props.negative ? `- ${value}` : value
  } else if (typeof props.optionValue === 'string') {
    return props.optionValue.charAt(0).toUpperCase() + props.optionValue.slice(1)
  } else {
    return props.optionValue
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.option-descr {
  display: flex;
  column-gap: 10px;
  flex-wrap: nowrap;

  &__name {
    white-space: wrap;
    font-weight: 600;
  }

  &__value {
    white-space: wrap;

    &--red {
      color: $grenadier;
    }
  }
}
</style>
