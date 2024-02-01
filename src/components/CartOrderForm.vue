<template>
  <form class="order-form">
    <app-option-descr
      class="order-form__count"
      option-name="Выбрано товаров"
      :option-value="amount"
    />
    <app-option-descr
      class="order-form__oldPrice"
      option-name="Цена"
      :option-value="oldPrice"
      :currency="true"
    />
    <app-option-descr
      v-if="priceDifference"
      class="order-form__priceDifference"
      option-name="Скидка"
      :option-value="priceDifference"
      :currency="true"
      :negative="true"
    />
    <app-option-descr
      v-if="showDelivery"
      class="order-form__delivery"
      option-name="Доставка"
      :option-value="deliveryPrice"
      :currency="true"
    />
    <app-option-descr
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
import AppOptionDescr from '@/components/common/AppOptionDescr.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

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
