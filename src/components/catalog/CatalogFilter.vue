<template>
  <div class="filter" @click.self="closeFilter">
    <div class="filter__inner" ref="filterElem">
      <button-cross
        class="filter__btn-close"
        aria-label="Закрыть фильтр товаров"
        ref="btnCloseElem"
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
</template>

<script lang="ts" setup>
import CatalogFilterFieldset from '@/components/catalog/CatalogFilterFieldset.vue'
import CheckboxList from '@/components/UI/CheckboxList.vue'
import ButtonSubmit from '@/components/UI/ButtonSubmit.vue'
import ButtonReset from '@/components/UI/ButtonReset.vue'
import ButtonCross from '@/components/UI/ButtonCross.vue'
import { lockScroll } from '@/helpers/lockScroll'
import { type PropType, ref, watch, onUnmounted, nextTick } from 'vue'
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
  brands: { type: Array as PropType<Brand[]>, required: true }
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

function setFocusOnBtnOpenFilter() {
  const btnOpenFilter: HTMLElement | null = document.getElementById('btn-filter')
  if (btnOpenFilter) {
    btnOpenFilter.focus()
  }
}

function closeFilter() {
  const offsetWidth = Number(document.body.offsetWidth)
  if (offsetWidth > 1024) {
    return
  }
  lockScroll(false)
  globalStore.toggleFilter()
  document.removeEventListener('focusin', handleFocusIn)
  setFocusOnBtnOpenFilter()
}

function closeFilterByEsc(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeFilter()
  }
}

function setQueryToFilter() {
  filterParams.value = getAllCatalogQueries.value
}

setQueryToFilter()

function focusBtnClose() {
  if (btnCloseElem.value && 'element' in btnCloseElem.value) {
    const btnClose: HTMLElement = btnCloseElem.value.element as HTMLElement
    nextTick(() => {
      btnClose.focus()
    })
  }
}

function handleFocusIn(event: FocusEvent): void {
  if (filterElem.value && !filterElem.value.contains(event.target as HTMLElement)) {
    focusBtnClose()
  }
}

watch(
  () => route.query,
  () => {
    setQueryToFilter()
  }
)

watch(
  () => globalStore.isfilterOpen,
  (newValue) => {
    if (newValue) {
      document.addEventListener('focusin', handleFocusIn)
      focusBtnClose()
    } else {
      document.removeEventListener('focusin', handleFocusIn)
    }
  }
)

document.addEventListener('keydown', closeFilterByEsc)

onUnmounted(() => document.removeEventListener('keydown', closeFilterByEsc))
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.filter {
  @media #{$screen-huge} {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    padding-top: 70px;
    padding-left: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    overflow-y: auto;
  }

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
      height: max-content;
      padding-bottom: 50px;
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
