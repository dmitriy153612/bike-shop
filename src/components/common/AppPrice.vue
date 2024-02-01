<template>
  <div class="price">
    <span class="price__current-price">{{ formatCurrency(price) }}</span>
    <span v-if="oldPrice" class="price__old-price">{{ formatCurrency(oldPrice) }}</span>
  </div>
</template>

<script lang="ts" setup>
import formatCurrency from '@/helpers/formatCurrency'

defineProps({
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null }
})
</script>
