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
@/interfaces/ProductInterfaces
