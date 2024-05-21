<template>
  <div class="product-info">
    <h3 class="product-info__title">Характеристики</h3>
    <ul class="product-info__list">
      <li v-for="(group, index) in infoList" :key="index" class="product-info__item">
        <h4 class="product-info__item-title">
          {{ group.infoGroupName }}
        </h4>
        <ul class="product-info__inner-list">
          <li
            v-for="(innerItem, index2) in group.infoList"
            :key="index2"
            class="product-info__inner-item"
          >
            <h5 class="product-info__inner-title">
              {{ innerItem.name }}
              <span />
            </h5>
            <p class="product-info__inner-text">
              {{ innerItem.property }}
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { type ProductInfo } from '@/interfaces/ProductInterfaces'
import { type PropType } from 'vue'

defineProps({
  infoList: { type: Array as PropType<ProductInfo[]>, required: true }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.product-info {
  &__title {
    margin: 0 0 20px;
    font-size: 24px;
  }

  &__list {
    display: grid;
    row-gap: 15px;
  }

  &__item-title {
    margin: 0 0 10px;
    font-size: 16px;
  }

  &__inner-list {
    display: grid;
    row-gap: 10px;
    padding-left: 15px;
  }

  &__inner-item {
    display: grid;
    grid-template-columns: 0.3fr 0.7fr;

    @media #{$screen-small} {
      row-gap: 4px;
      grid-template-columns: 1fr;
    }
  }

  &__inner-title {
    position: relative;
    align-self: flex-end;
    display: flex;
    align-items: flex-end;
    margin: 0;
    font-weight: 800;
    font-size: 14px;

    & span {
      flex-grow: 1;
      border-bottom: 1px dotted $boulder;
      margin: 0 5px;
      min-width: 15px;

      @media #{$screen-small} {
        display: none;
      }
    }
  }

  &__inner-text {
    align-self: flex-end;
    margin: 0;
  }
}
</style>
