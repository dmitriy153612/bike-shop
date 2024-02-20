<template>
  <app-section class="catalog-sec">
    <app-title class="catalog-sec__title"> Mountain bikes </app-title>
    <transition :name="filterTransitionType">
      <catalog-filter
        v-if="isFilterLoaded && globalStore.isfilterOpen"
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
    <div></div>

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
import { useGlobalStore } from '@/stores/globalStore'
import { computed, ref, watchEffect, watch, onUnmounted } from 'vue'
import { lockScroll } from '@/helpers/lockScroll'
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
const globalStore = useGlobalStore()

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

const currentOffsetWidth = ref<number>(0)
const iscurrentOffsetWidthGreater1024 = ref(!(Number(document.body.offsetWidth) > 1024))

const filterTransitionType = computed(() => {
  if (currentOffsetWidth.value > 1024) {
    return 'appear-left'
  }
  return 'appear'
})

function setSortingId(id: string) {
  sortingId.value = id
}

function toggleFilterByResize() {
  currentOffsetWidth.value = Number(document.body.offsetWidth)
  if (currentOffsetWidth.value > 1024 && !iscurrentOffsetWidthGreater1024.value) {
    globalStore.toggleFilter(true)
    console.log('a lot')
    iscurrentOffsetWidthGreater1024.value = true
  } else if (currentOffsetWidth.value <= 1024 && iscurrentOffsetWidthGreater1024.value) {
    globalStore.toggleFilter(false)
    console.log('a little')
    iscurrentOffsetWidthGreater1024.value = false
  }
}
toggleFilterByResize()

window.addEventListener('resize', toggleFilterByResize)

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
  () => globalStore.isfilterOpen,
  (newValue) => {
    if (newValue && currentOffsetWidth.value <= 1024) {
      lockScroll(true)
    } else {
      lockScroll(false)
    }
  }
)

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
onUnmounted(() => {
  window.removeEventListener('resize', toggleFilterByResize)
})
</script>
