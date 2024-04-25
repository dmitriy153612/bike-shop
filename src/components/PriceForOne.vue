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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.price-for-one {
  display: grid;
  font-weight: 600;

  &__amount {
    text-align: end;
  }
  &__price {
    color: $boulder;
    font-size: 12px;
  }
}
</style>
