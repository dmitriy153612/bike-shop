<template>
  <form class="order-form">
    <option-descr class="order-form__count" option-name="Выбрано товаров" :option-value="amount" />
    <option-descr
      class="order-form__oldPrice"
      option-name="Цена"
      :option-value="oldPrice"
      :currency="true"
    />
    <option-descr
      v-if="priceDifference"
      class="order-form__priceDifference"
      option-name="Скидка"
      :option-value="priceDifference"
      :currency="true"
      :negative="true"
      :red-value="true"
    />
    <option-descr
      v-if="showDelivery"
      class="order-form__delivery"
      option-name="Доставка"
      :option-value="deliveryPrice"
      :currency="true"
    />
    <option-descr
      class="order-form__price"
      option-name="ИТОГО"
      :option-value="price"
      :currency="true"
    />
    <slot />
    <transition name="appear">
      <app-spinner v-if="showSpinner" type="card" />
    </transition>
  </form>
</template>

<script lang="ts" setup>
import OptionDescr from '@/components/OptionDescr.vue'
import AppSpinner from '@/components/AppSpinner.vue'

defineProps({
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  priceDifference: { type: Number, default: null },
  oldPrice: { type: Number, default: null },
  deliveryPrice: { type: Number, default: null },
  showDelivery: { type: Boolean, default: false },
  showSpinner: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.order-form {
  display: grid;

  gap: 10px;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 9px 3px rgba($black, 0.32);

  &__price {
    padding-top: 20px;
    padding-bottom: 10px;
  }
}
</style>
