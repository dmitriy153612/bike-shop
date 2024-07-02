<template>
  <app-overlay @close="closeFilter" :disabled="isOverlayDisabled">
    <div class="filter">
      <div class="filter__inner">
        <button-cross
          class="filter__btn-close"
          aria-label="Закрыть фильтр товаров"
          @click.prevent="closeFilter"
        />
        <form class="filter__form" @submit.prevent="setFilterToRoute">
          <div class="filter__form-inner">
            <h2 class="filter__title">Фильтр</h2>
            <catalog-filter-fieldset v-if="brands.length" class="filter__brand" legend="Бренд">
              <checkbox-list v-model="filterParams.brandId" :properties="brands" />
            </catalog-filter-fieldset>
            <catalog-filter-fieldset v-if="sizes.length" class="filter__size" legend="Размер">
              <checkbox-list v-model="filterParams.sizeId" :properties="sizes" />
            </catalog-filter-fieldset>
            <catalog-filter-fieldset v-if="colors.length" class="filter__color" legend="Цвет">
              <checkbox-list v-model="filterParams.colorId" :properties="colors" />
            </catalog-filter-fieldset>
            <div class="filter__price-box">
              <app-input v-model="filterParams.minPrice" input-type="currency" label="Цена от" />
              <app-input v-model="filterParams.maxPrice" input-type="currency" label="Цена до" />
            </div>
            <button-submit
              type="submit"
              class="filter__btn-submit"
              btn-name="Применить"
              @click.prevent="setFilterToRoute"
            />
            <button-reset
              class="filter__btn-reset"
              btn-name="Сбросить"
              @click.prevent="resetFilter"
            />
          </div>
        </form>
      </div>
    </div>
  </app-overlay>
</template>

<script lang="ts" setup>
import CatalogFilterFieldset from '@/components/catalog/CatalogFilterFieldset.vue'
import CheckboxList from '@/components/UI/CheckboxList.vue'
import ButtonSubmit from '@/components/UI/ButtonSubmit.vue'
import ButtonReset from '@/components/UI/ButtonReset.vue'
import ButtonCross from '@/components/UI/ButtonCross.vue'
import AppOverlay from '@/components/layouts/AppOverlay.vue'
import { type PropType, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGetQueryFromRoute } from '@/composables/getCatalogQueries'
import AppInput from '@/components/UI/AppInput.vue'
import { useGlobalStore } from '@/stores/globalStore'
import {
  type Size,
  type Brand,
  type Color,
  type FilterParams,
  type CatalogPageParams
} from '@/interfaces/CatalogInterfaces'

defineProps({
  colors: { type: Array as PropType<Color[]>, required: true },
  sizes: { type: Array as PropType<Size[]>, required: true },
  brands: { type: Array as PropType<Brand[]>, required: true },
  isOverlayDisabled: { type: Boolean, default: false }
})

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

const { getAllCatalogQueries } = useGetQueryFromRoute()

const filterParams = ref<CatalogPageParams>({
  colorId: [],
  sizeId: [],
  brandId: [],
  minPrice: 0,
  maxPrice: 0,
  page: 1
})

function resetFilter() {
  filterParams.value = {
    colorId: [],
    sizeId: [],
    brandId: [],
    minPrice: undefined,
    maxPrice: undefined,
    page: 1
  }
  updateRoute(filterParams.value)
}

function updateRoute(params: CatalogPageParams) {
  router.replace({
    query: {
      ...route.query,
      ...params
    }
  })
  closeFilter()
}

function setFilterToRoute() {
  const params: Record<string, number | undefined | string[]> = {}
  Object.keys(filterParams.value).forEach((key) => {
    const value = filterParams.value[key as keyof FilterParams]
    if (Array.isArray(value) || (typeof value === 'number' && value > 0) || value === undefined) {
      params[key as keyof CatalogPageParams] = value
    }
    if (value === 0) {
      params[key as keyof CatalogPageParams] = undefined
    }
  })
  const updatedParams: CatalogPageParams = { ...params, page: 1 } as CatalogPageParams

  updateRoute(updatedParams)
}

function closeFilter() {
  const offsetWidth = Number(document.body.offsetWidth)
  if (offsetWidth > 1024) {
    return
  }
  globalStore.toggleFilter()
}

function setQueryToFilter() {
  filterParams.value = getAllCatalogQueries.value
}

setQueryToFilter()

watch(
  () => route.query,
  () => {
    setQueryToFilter()
  }
)
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.filter {
  &__inner {
    position: relative;
  }

  &__btn-close {
    display: none;

    @media #{$screen-huge} {
      position: absolute;
      top: 8px;
      right: 8px;
      display: block;
    }
  }

  &__form {
    @media #{$screen-huge} {
      max-height: 100%;
      height: max-content;
    }
  }

  &__form-inner {
    width: 100%;
    display: grid;
    align-self: flex-start;
    background-color: $black;
    align-content: flex-start;
    gap: 15px;
    padding: 15px;
    color: $white;
    outline: 1px solid $white;
  }

  &__title {
    margin: 0;

    @media #{$screen-huge} {
      grid-column: 1 / 3;
    }
  }

  &__price-box {
    display: grid;
    gap: 20px;
    padding-top: 15px;

    @media #{$screen-huge} {
      grid-column: 1 / 3;
    }
  }

  &__btn-submit {
    @media #{$screen-huge} {
      grid-column: 1 / 3;
    }
  }

  &__btn-reset {
    @media #{$screen-huge} {
      grid-column: 1 / 3;
    }
  }
}
</style>
