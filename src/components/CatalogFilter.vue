<template>
  <aside
    class="filter-wrapper"
    @click.self="globalStore.toggleFilter"
    @keyup.esc="closeFilterByEsc"
  >
    <div class="filter-wrapper__div" ref="filterElem">
      <app-button-cross
        class="filter-wrapper__btn-close"
        aria-label="Закрыть фильтр товаров"
        ref="btnCloseElem"
        v-focus
        @click.prevent="globalStore.toggleFilter"
      />
      <form class="filter filter-wrapper__filter">
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
          <app-button-submit
            type="button"
            class="filter__btn-submit"
            btn-name="Применить"
            @click.prevent="setFilterToRoute"
          />
          <app-button-reset
            class="filter__btn-reset"
            btn-name="Сбросить"
            @click.prevent="resetFilter"
          />
        </div>
      </form>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import CatalogFilterFieldset from '@/components/CatalogFilterFieldset.vue'
import CatalogFilterCheckboxList from '@/components/CatalogFilterCheckboxList.vue'
import AppButtonSubmit from '@/components/UI/AppButtonSubmit.vue'
import AppButtonReset from '@/components/UI/AppButtonReset.vue'
import AppButtonCross from '@/components/UI/AppButtonCross.vue'
import { type PropType, ref, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import setQueryToFilter from '@/helpers/setQueryToFilter'
import AppInput from '@/components/UI/AppInput.vue'
import { useGlobalStore } from '@/stores/globalStore'
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
const globalStore = useGlobalStore()

const filterParams = ref<FilterParams>({
  colorId: [],
  sizeId: [],
  brandId: [],
  minPrice: 0,
  maxPrice: 0,
  page: 1
})

const filterElem = ref<HTMLElement | null>(null)
const btnCloseElem = ref<HTMLElement | null>(null)

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

function updateRoute(params: FilterParams) {
  router.replace({
    query: {
      ...route.query,
      ...params
    }
  })
  globalStore.toggleFilter(false)
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
}

function setFocusOnBtnOpenFilter() {
  const btnOpenFilter: HTMLElement | null = document.getElementById('btn-filter')
  if (btnOpenFilter) {
    btnOpenFilter.focus()
  }
}

function closeFilterByEsc() {
  const offsetWidth = Number(document.body.offsetWidth)
  if (offsetWidth > 1024) {
    return
  }
  globalStore.toggleFilter(false)
}

setQueryToFilter(route.query, filterParams)

function handleFocusIn(event: FocusEvent): void {
  if (filterElem.value && !filterElem.value.contains(event.target as HTMLElement)) {
    event.preventDefault()
    if (btnCloseElem.value && 'element' in btnCloseElem.value) {
      const btnClose: HTMLElement = btnCloseElem.value.element as HTMLElement
      btnClose.focus()
    }
  }
}

onMounted(() => document.addEventListener('focusin', handleFocusIn))

onUnmounted(() => {
  setFocusOnBtnOpenFilter()
})
</script>

<style lang="scss"></style>
