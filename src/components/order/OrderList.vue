<template>
  <div class="order-list">
    <h2 class="order-list__title">Мой заказ</h2>
    <ul class="order-list__list">
      <li v-for="(product, index) in orderList" :key="index" class="order-list__item">
        <order-product-item :product="product" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import OrderProductItem from '@/components/order/OrderProductItem.vue'
import { type OrderProduct } from '@/interfaces/OrderInterfaces'
import { type PropType } from 'vue'

defineProps({
  orderList: { type: Array as PropType<OrderProduct[]>, required: true }
})
</script>

<style lang="scss" scoped>
.order-list {
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 9px 3px rgba(0, 0, 0, 0.32);
  &__title {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
  }
  &__list {
    display: grid;
    gap: 20px;
  }
}
</style>
