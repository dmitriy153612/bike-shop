<template>
  <div class="catalog-page">
    <app-container class="catalog-page__container">
      <app-title class="catalog-page__title"> Mountain bikes </app-title>
      <transition name="appear-left">
        <aside class="catalog-page__aside" v-if="isFilterLoaded">
          <teleport to="body" :disabled="isFilterOverlayDisabled">
            <transition name="appear">
              <catalog-filter
                v-if="isFilterVisible"
                class="catalog-page__filter"
                :is-overlay-disabled="isFilterOverlayDisabled"
                :colors="filterSore.colors"
                :sizes="filterSore.sizes"
                :brands="filterSore.brands"
              />
            </transition>
          </teleport>
        </aside>
      </transition>
      <transition name="appear-top">
        <app-select
          v-if="isFilterLoaded && totalProductsAmount"
          class="catalog-page__select"
          placeholder="Сортировка"
          :properties="sortingArr"
          :selected-id="sortingId"
          @select="setSortingId"
        />
      </transition>

      <div class="catalog-page__counter-box">
        <transition name="appear">
          <catalog-counter v-if="isCatalogLoaded" :amount="totalProductsAmount" />
        </transition>
      </div>
      <div class="catalog-page__applied-filters-box">
        <applied-filters />
      </div>

      <main class="catalog-page__main">
        <section class="catalog-page__sec">
          <catalog-list
            v-if="isCatalogLoaded"
            class="catalog-page__list"
            :catalog="catalogStore.catalog"
          />
        </section>
      </main>
      <app-pagination
        v-if="totalPages > 1 && isCatalogLoaded"
        class="catalog-page__pagination"
        :total-pages="totalPages"
      />
    </app-container>
  </div>
</template>

<script lang="ts" setup>
import AppTitle from '@/components/AppTitle.vue'
import AppContainer from '@/components/layouts/AppContainer.vue'
import CatalogList from '@/components/catalog/CatalogList.vue'
import CatalogFilter from '@/components/catalog/CatalogFilter.vue'
import CatalogCounter from '@/components/catalog/CatalogCounter.vue'
import AppPagination from '@/components/nav/AppPagination.vue'
import { useGetQueryFromRoute } from '@/composables/getCatalogQueries'
import AppSelect from '@/components/UI/AppSelect.vue'
import AppliedFilters from '@/components/catalog/CatalogAppliedFilters.vue'
import { useCatalogStore } from '@/stores/catalogStore'
import { useFilterStore } from '@/stores/filterSore'
import { useGlobalStore } from '@/stores/globalStore'
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type SortingItem, type CatalogConfig } from '@/interfaces/CatalogInterfaces'

const route = useRoute()
const router = useRouter()
const filterSore = useFilterStore()
const catalogStore = useCatalogStore()
const globalStore = useGlobalStore()
const { getAllCatalogQueries } = useGetQueryFromRoute()

const sortingId = ref<string>('')

const sortingArr: SortingItem[] = [
  { label: 'По релевантности', id: '' },
  { label: 'Цена по возрастанию', id: 'priceUp' },
  { label: 'Цена по убыванию', id: 'priceDown' }
]

const isFilterOverlayDisabled = computed(() => {
  if (
    globalStore.screenWidth > 1024 ||
    (globalStore.screenWidth <= 1024 && !globalStore.isfilterOpen)
  ) {
    return true
  }
  return false
})

const isFilterVisible = computed(() => {
  if (globalStore.screenWidth > 1024) {
    return true
  } else if (globalStore.screenWidth <= 1024 && globalStore.isfilterOpen) {
    return true
  }
  return false
})

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

catalogStore.fetchCatalog(getAllCatalogQueries.value)

function setSortingId(id: string) {
  sortingId.value = id
}

watch(
  () => route.query,
  () => {
    catalogStore.fetchCatalog(getAllCatalogQueries.value)
  }
)

watch(
  () => sortingId.value,
  () => {
    const sort = sortingId.value ? sortingId.value : undefined
    router.replace({ query: { ...route.query, sorting: sort } })
  }
)
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.catalog-page {
  &__container {
    display: grid;
    grid-template-columns: minmax(157px, min-content) auto 1fr;
    grid-template-rows: auto auto auto 1fr auto;
    grid-template-areas:
      'title title title'
      'aside select counter'
      'aside applied-filters applied-filters'
      'aside main main'
      '. pagination pagination';
    column-gap: 30px;
    height: 100%;
    overflow-x: hidden;

    @media #{$screen-huge} {
      grid-template-columns: auto 1fr;
      grid-template-areas:
        'title title'
        'select counter'
        'applied-filters applied-filters'
        'main main'
        'pagination pagination';
      column-gap: 15px;
    }
  }

  &__title {
    grid-area: title;
    justify-self: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  &__aside {
    grid-area: aside;

    @media #{$screen-huge} {
      position: absolute;
    }
  }

  &__select {
    grid-area: select;
    justify-self: flex-start;
    align-self: flex-start;
  }

  &__counter-box {
    grid-area: counter;
  }

  &__applied-filters-box {
    grid-area: applied-filters;
  }

  &__main {
    grid-area: main;
  }

  &__list {
    grid-area: list;
    padding-top: 18px;
    padding-bottom: 36px;
  }

  &__pagination {
    grid-area: pagination;
    justify-self: center;
  }
}
</style>
