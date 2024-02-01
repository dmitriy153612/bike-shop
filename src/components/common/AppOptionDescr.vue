<template>
  <div class="option-descr">
    <span class="option-descr__name">{{ optionName }}: </span>
    <span class="option-descr__value">{{ formattedOptionValue }}</span>
  </div>
</template>

<script lang="ts" setup>
import formatCurrency from '@/helpers/formatCurrency'
import { computed } from 'vue'

const props = defineProps({
  optionName: { type: String, required: true },
  optionValue: { type: [String, Number], required: true },
  currency: Boolean,
  negative: Boolean
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
