<template>
  <div class="price" :class="{ 'price--order': orderItemType }">
    <span class="price__current-price">{{ formatCurrency(price) }}</span>
    <span v-if="oldPrice" class="price__old-price">{{ formatCurrency(oldPrice) }}</span>
  </div>
</template>

<script lang="ts" setup>
import formatCurrency from '@/helpers/formatCurrency'

defineProps({
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  orderItemType: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.price {
  display: flex;
  column-gap: 20px;
  row-gap: 4px;

  &--order {
    flex-direction: row-reverse;

    @media #{$screen-medium} {
      flex-direction: column;
      gap: 2px;
    }
  }

  &--order & {
    &__current-price {
      font-size: 16px;
    }

    &__old-price {
      font-size: 14px;
    }
  }

  &__current-price {
    font-size: 20px;
    font-weight: 600;
  }

  &__old-price {
    font-size: 16px;
    color: $boulder;
    text-decoration: line-through;
  }
}
</style>
