<template>
  <app-section class="catalog-sec">
    <app-title class="catalog-sec__title"> Mountain bikes </app-title>
    <transition :name="windowInnerWidth > 1024 ? 'appear-left' : 'appear'">
      <catalog-filter
        v-if="isFilterLoaded"
        class="catalog-sec__filter"
        :colors="filterSore.colors"
        :sizes="filterSore.sizes"
        :brands="filterSore.brands"
      />
    </transition>

    <transition name="appear-top">
      <app-select
        v-if="isFilterLoaded"
        class="catalog-sec__select"
        placeholder="Сортировка"
        :properties="sortingArr"
        :selected-id="sortingId"
        @select="setSortingId"
      />
    </transition>

    <transition name="appear">
      <catalog-counter
        v-if="isCatalogLoaded"
        class="catalog-sec__counter"
        :amount="totalProductsAmount"
      />
    </transition>

    <transition name="appear">
      <catalog-list
        v-if="isCatalogLoaded"
        class="catalog-sec__list"
        :catalog="catalogStore.catalog"
      />
    </transition>
    <app-pagination
      v-if="totalPages > 1"
      class="catalog-sec__pagination"
      :total-pages="totalPages"
    />
  </app-section>
</template>

<script lang="ts" setup>
import AppTitle from '@/components/common/AppTitle.vue'
import AppSection from '@/components/common/AppSection.vue'
import CatalogList from '@/components/CatalogList.vue'
import CatalogFilter from '@/components/CatalogFilter.vue'
import CatalogCounter from '@/components/CatalogCounter.vue'
import AppPagination from '@/components/UI/AppPagination.vue'
import setQueryToFilter from '@/helpers/setQueryToFilter'
import AppSelect from '@/components/UI/AppSelect.vue'
import { useCatalogStore } from '@/stores/catalogStore'
import { useFilterStore } from '@/stores/filterSore'
import { computed, ref, watchEffect, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  type FilterParams,
  type SortingItem,
  type CatalogConfig
} from '@/interfaces/CatalogInterfaces'

const route = useRoute()
const router = useRouter()
const filterSore = useFilterStore()
const catalogStore = useCatalogStore()

const sortingId = ref<string>('')
const catalogParams = ref<FilterParams>({
  colorId: [],
  sizeId: [],
  brandId: [],
  minPrice: 0,
  maxPrice: 0,
  page: 1
})

const sortingArr: SortingItem[] = [
  { label: 'По релевантности', id: '' },
  { label: 'Цена по возрастанию', id: 'priceUp' },
  { label: 'Цена по убыванию', id: 'priceDown' }
]

filterSore.fetchColors()
filterSore.fetchSizes()
filterSore.fetchBrands()

const config = computed<CatalogConfig | null>(() => catalogStore.config)

const totalProductsAmount = computed<number>(() => {
  if (config.value && 'totalProducts' in config.value) {
    return config.value.totalProducts
  }
  return 0
})

const isFilterLoaded = computed<boolean>(() => {
  if (!filterSore.isColorsLoading && !filterSore.isSizesLoading && !filterSore.isBrandsLoading) {
    return true
  }
  return false
})

const isCatalogLoaded = computed<boolean>(() => !catalogStore.isLoading)

const totalPages = computed<number>(() => {
  if (config.value && 'totalPages' in config.value) {
    return config.value.totalPages
  }
  return 0
})

const windowInnerWidth = ref<number>(0)

function setSortingId(id: string) {
  sortingId.value = id
}

function setWindowInnerWidth() {
  windowInnerWidth.value = window.innerWidth
}
setWindowInnerWidth()

watchEffect(() => {
  if (route.name === 'catalog') {
    if (!route.query['page']) {
      router.replace({ query: { ...route.query, page: 1 } })
    }
    setQueryToFilter(route.query, catalogParams)
    catalogStore.fetchCatalog(catalogParams.value)
  }
})

watch(
  () => sortingId.value,
  (newValue) => {
    router.replace({ query: { ...route.query, sorting: newValue || undefined } })
  },
  { deep: true }
)
watch(
  () => route.query['sorting'],
  (newValue) => {
    if (!newValue) {
      const firstElemFromSortingArr: SortingItem | undefined = sortingArr[0]
      if (firstElemFromSortingArr) {
        setSortingId(firstElemFromSortingArr.id)
      }
    } else {
      const sortingObj: SortingItem | undefined = sortingArr.find((obj) => obj.id === newValue)
      if (sortingObj) {
        setSortingId(sortingObj.id)
      }
    }
  },
  { immediate: true }
)
window.addEventListener('resize', setWindowInnerWidth)
onUnmounted(() => window.removeEventListener('resize', setWindowInnerWidth))
</script>
