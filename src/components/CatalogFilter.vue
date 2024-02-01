<template>
  <aside ref="filterWrapperElem" class="filter-wrapper">
    <button
      class="filter-wrapper__btn-open"
      aria-label="Открыть фильтр товаров"
      @click.prevent="openFilter"
    >
      <svg class="icon">
        <use xlink:href="#filter" />
      </svg>
    </button>
    <transition name="appear-left">
      <form
        v-if="showFilter"
        ref="filterElem"
        class="filter filter-wrapper__filter"
        @submit.prevent="setFilterToRoute"
      >
        <app-button-cross
          class="filter__btn-close"
          aria-label="Закрыть фильтр товаров"
          @click.prevent="openFilter"
        />
        <div class="filter__inner">
          <h2 class="filter__title">Фильтр</h2>
          <catalog-filter-fieldset v-if="brands.length" class="filter__brand" legend="Бренд">
            <catalog-filter-checkbox-list v-model="filterParams.brandId" :properties="brands" />
          </catalog-filter-fieldset>
          <catalog-filter-fieldset v-if="sizes.length" class="filter__size" legend="Размер">
            <catalog-filter-checkbox-list v-model="filterParams.sizeId" :properties="sizes" />
          </catalog-filter-fieldset>
          <catalog-filter-fieldset v-if="colors.length" class="filter__color" legend="Цвет">
            <catalog-filter-checkbox-list v-model="filterParams.colorId" :properties="colors" />
          </catalog-filter-fieldset>
          <div class="filter__price-box">
            <app-input v-model="filterParams.minPrice" input-type="number" label="Цена от" />
            <app-input v-model="filterParams.maxPrice" input-type="number" label="Цена до" />
          </div>
          <app-button-submit class="filter__btn-submit" btn-name="Применить" />
          <app-button-reset
            class="filter__btn-reset"
            btn-name="Сбросить"
            @click.prevent="resetFilter"
          />
        </div>
      </form>
    </transition>
  </aside>
</template>

<script lang="ts" setup>
import CatalogFilterFieldset from '@/components/CatalogFilterFieldset.vue'
import CatalogFilterCheckboxList from '@/components/CatalogFilterCheckboxList.vue'
import AppButtonSubmit from '@/components/UI/AppButtonSubmit.vue'
import AppButtonReset from '@/components/UI/AppButtonReset.vue'
import AppButtonCross from '@/components/UI/AppButtonCross.vue'
import { type PropType, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import setQueryToFilter from '@/helpers/setQueryToFilter'
import AppInput from '@/components/UI/AppInput.vue'
import {
  type Size,
  type Brand,
  type Color,
  type FilterParams
} from '@/interfaces/CatalogInterfaces'

defineProps({
  colors: { type: Array as PropType<Color[]>, required: true },
  sizes: { type: Array as PropType<Size[]>, required: true },
  brands: { type: Array as PropType<Brand[]>, required: true }
})

const route = useRoute()
const router = useRouter()

const filterElem = ref(null)
const filterWrapperElem = ref(null)
const showFilter = ref(true)

const filterParams = ref<FilterParams>({
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
  openFilter()
}

function updateRoute(params: FilterParams) {
  router.replace({
    query: {
      ...route.query,
      ...params
    }
  })
}

function setFilterToRoute() {
  const params: Record<string, number | undefined | string[]> = {}
  Object.keys(filterParams.value).forEach((key) => {
    const value = filterParams.value[key as keyof FilterParams]
    if (Array.isArray(value) || (typeof value === 'number' && value > 0) || value === undefined) {
      params[key as keyof FilterParams] = value
    }
    if (value === 0) {
      params[key as keyof FilterParams] = undefined
    }
  })
  const updatedParams = { ...params, page: 1 } as FilterParams

  updateRoute(updatedParams)
  openFilter()
}

setQueryToFilter(route.query, filterParams)

function hideFilter() {
  if (window.innerWidth <= 1024) {
    showFilter.value = false
  } else {
    showFilter.value = true
  }
}
hideFilter()

function openFilter() {
  if (window.innerWidth > 1024) {
    return
  }
  showFilter.value = !showFilter.value
}

onMounted(() => {
  addEventListener('resize', hideFilter)
})

onUnmounted(() => {
  removeEventListener('resize', hideFilter)
})
</script>
