<template>
  <div class="order-item">
    <router-link
      class="order-item__link"
      :to="{
        name: 'product',
        params: { id: product.productId },
        query: { sizeId: product.size._id }
      }"
    >
      <img class="order-item__img" loading="lazy" :src="product.picture" :alt="product.title" />
    </router-link>
    <h3 class="order-item__title">
      {{ product.title }}
    </h3>
    <option-descr class="order-item__size" option-name="Размер" :option-value="product.size.name" />
    <option-descr class="order-item__color" option-name="Цвет" :option-value="product.color.name" />
    <price-for-one
      v-if="product.amount > 1"
      class="order-item__price-for-one"
      :price-for-one="product.priceForOne"
      :amount="product.amount"
    />
    <app-price
      class="order-item__price"
      :price="product.price"
      :old-price="product.oldPrice"
      :order-item-type="true"
    />
    <option-descr
      v-if="product.priceDifference"
      class="order-item__price-difference"
      option-name="Скидка"
      :red-value="true"
      :option-value="product.priceDifference"
      :currency="true"
      :negative="true"
    />
  </div>
</template>

<script lang="ts" setup>
import OptionDescr from '@/components/OptionDescr.vue'
import AppPrice from '@/components/AppPrice.vue'
import PriceForOne from '@/components/PriceForOne.vue'
import { type OrderProduct } from '@/interfaces/OrderInterfaces'

defineProps({
  product: { type: Object as () => OrderProduct, required: true }
})
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.order-item {
  display: grid;
  grid-template-columns: auto 1fr 130px 80px 180px;
  grid-template-areas:
    'link title size price-for-one price'
    'link title color price-for-one price-difference';
  gap: 14px;
  border: 1px solid $alto;
  border-radius: 6px;
  padding: 6px;

  @media #{$screen-huge} {
    grid-template-columns: auto 1fr 120px 180px;
    grid-template-areas:
      'link title size price'
      'link title color price-for-one'
      'link price-difference price-difference price-difference';
  }

  @media #{$screen-medium} {
    grid-template-columns: auto 1fr 100px;
    gap: 6px;
    grid-template-areas:
      'title title price'
      'link size price'
      'link color price-for-one'
      'link price-difference price-difference';
  }

  &__link {
    grid-area: link;
    @media #{$screen-huge} {
      align-self: center;
    }
  }
  &__img {
    width: 80px;
    height: auto;
  }
  &__title {
    grid-area: title;
    margin: 0;
    font-size: 18px;
  }
  &__size {
    grid-area: size;
  }
  &__color {
    grid-area: color;
    max-width: 100%;
  }
  &__price-for-one {
    grid-area: price-for-one;
    justify-self: flex-end;
  }
  &__price {
    grid-area: price;
    justify-self: flex-end;
  }
  &__price-difference {
    grid-area: price-difference;
    justify-self: flex-end;
  }
  &__size,
  &__color,
  &__price-difference {
    font-size: 14px;
  }
}
</style>
