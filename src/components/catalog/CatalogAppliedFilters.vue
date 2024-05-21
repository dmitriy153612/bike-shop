<template>
  <div class="applied-filters" :class="{ 'applied-filters--empty': !checkedFilters.length }">
    <ul class="applied-filters__list">
      <li class="applied-filters__item" v-for="(filter, index) in checkedFilters" :key="index">
        <button-cross
          :bordered="true"
          :name="filter.name"
          @click="removeFilter(filter.queryName, filter._id)"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue'
import { type Size, type FilterName, type FilterParams } from '@/interfaces/CatalogInterfaces'
import { useGetQueryFromRoute } from '@/composables/getCatalogQueries'
import { useFilterStore } from '@/stores/filterSore'
import { useRoute, useRouter } from 'vue-router'
import ButtonCross from '@/components/UI/ButtonCross.vue'

const { brands, colors, sizes } = toRefs(useFilterStore())
const { getFilter } = useGetQueryFromRoute()
const route = useRoute()
const router = useRouter()

interface FilterQuery extends Omit<Size, 'nameEn'> {
  queryName: FilterName
}

function getArray(value: string | string[] | number | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.toString())
  } else if (value) {
    return [value.toString()]
  } else {
    return []
  }
}

function getCheckedFilter(checkedFilterId: string, queryName: FilterName) {
  const filterFromStore = ref<Size[]>([])
  if (queryName === 'brandId') {
    filterFromStore.value = brands.value
  } else if (queryName === 'sizeId') {
    filterFromStore.value = sizes.value
  } else if (queryName === 'colorId') {
    filterFromStore.value = colors.value
  }

  const checkedFilterObj = filterFromStore.value.find((filter) => filter._id === checkedFilterId)
  if (checkedFilterObj) {
    return { _id: checkedFilterObj._id, name: checkedFilterObj.name, queryName: queryName }
  }
}

function getCheckedFilters(): FilterQuery[] {
  const result: FilterQuery[] = []

  Object.entries(getFilter.value).forEach(([key, value]) => {
    if (key === 'minPrice' || key === 'maxPrice') {
      if (value) {
        const priceText = {
          minPrice: `Цена от ${value}`,
          maxPrice: `Цена до ${value}`
        }
        result.push({ _id: key, name: priceText[key], queryName: key })
      }
    } else {
      getArray(value).forEach((filterId) => {
        const checkedFilter = getCheckedFilter(filterId, key as FilterName)
        if (checkedFilter) {
          result.push(checkedFilter)
        }
      })
    }
  })
  return result
}

const checkedFilters = computed(() => getCheckedFilters())

function removeFilter(queryName: FilterName, filterId: string) {
  const filter: FilterParams = { ...getFilter.value }

  if (queryName in filter) {
    if (queryName === 'minPrice' || queryName === 'maxPrice') {
      filter[queryName] = undefined
    } else {
      if (Array.isArray(filter[queryName])) {
        const filterArr = filter[queryName] as string[]
        filter[queryName] = filterArr.filter((id) => id !== filterId)
      } else {
        filter[queryName] = []
      }
    }
  }
  router.replace({ query: { ...route.query, ...filter } })
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.applied-filters {
  padding-top: 10px;
  padding-bottom: 10px;

  &--empty {
    padding-top: 0;
    padding-bottom: 0;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
