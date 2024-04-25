<template>
  <ul class="catalog">
    <li v-for="card in catalog" :key="card._id" class="catalog__item">
      <catalog-card
        :id="card._id"
        :discount="card.discount"
        :title="card.title"
        :sizes="card.sizes"
        :color="card.color"
        :price="card.price"
        :old-price="card.oldPrice"
        :img="card.pictures[0]"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import CatalogCard from '@/components/CatalogCard.vue'
import { type Product } from '@/interfaces/CatalogInterfaces'
import { type PropType } from 'vue'

defineProps({
  catalog: { type: Array as PropType<Product[]>, required: true }
})
</script>

<style lang="scss" scoped>
.catalog {
  align-self: flex-start;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
</style>
