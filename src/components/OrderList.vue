<template>
  <div class="order-list-wrapper">
    <h2 class="order-list-wrapper__title">Мой заказ</h2>
    <ul class="order-list-wrapper__list order-list">
      <li v-for="(order, index) in orderList" :key="index" class="order-list__item order-item">
        <router-link
          class="order-item__link"
          :to="{
            name: 'product',
            params: { id: order.productId },
            query: { sizeId: order.size._id }
          }"
        >
          <img class="order-item__img" loading="lazy" :src="order.picture" :alt="order.title" />
        </router-link>
        <h3 class="order-item__title">
          {{ order.title }}
        </h3>
        <app-option-descr
          class="order-item__size"
          option-name="Размер"
          :option-value="order.size.name"
        />
        <app-option-descr
          class="order-item__color"
          option-name="Цвет"
          :option-value="order.color.name"
        />
        <app-price-for-one
          v-if="order.amount > 1"
          class="order-item__price-for-one"
          :price-for-one="order.priceForOne"
          :amount="order.amount"
        />
        <app-price class="order-item__price" :price="order.price" :old-price="order.oldPrice" />
        <app-option-descr
          v-if="order.priceDifference"
          class="order-item__price-difference"
          option-name="Скидка"
          :option-value="order.priceDifference"
          :currency="true"
          :negative="true"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import AppOptionDescr from '@/components/common/AppOptionDescr.vue'
import AppPrice from '@/components/common/AppPrice.vue'
import AppPriceForOne from '@/components/common/AppPriceForOne.vue'
import { type OrderProduct } from '@/interfaces/OrderInterfaces'
import { type PropType } from 'vue'

defineProps({
  orderList: { type: Array as PropType<OrderProduct[]>, required: true }
})
</script>
@/interfaces/OrderInterfaces
