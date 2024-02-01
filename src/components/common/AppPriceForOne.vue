<template>
  <div class="price-for-one">
    <span v-if="amount" class="price-for-one__amount">{{ amount }} шт.</span>
    <span class="price-for-one__price">{{ formatCurrency(priceForOne) }}/шт.</span>
  </div>
</template>

<script lang="ts" setup>
import formatCurrency from '@/helpers/formatCurrency'

defineProps({
  priceForOne: { type: Number, required: true },
  amount: { type: Number, default: null }
})
</script>
