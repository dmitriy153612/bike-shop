import { type Ref } from 'vue'
import { type FilterParams } from '@/interfaces/CatalogInterfaces'

function getArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value
  }
  if (value === null || value === undefined) {
    return []
  }
  return [value.toString()]
}

export default function setQueryToFilter(
  query: Partial<FilterParams>,
  filterParams: Ref<FilterParams>
) {
  filterParams.value.colorId = getArray(query.colorId)
  filterParams.value.sizeId = getArray(query.sizeId)
  filterParams.value.brandId = getArray(query.brandId)
  filterParams.value.minPrice = Number(query.minPrice)
  filterParams.value.maxPrice = Number(query.maxPrice)
  filterParams.value.sorting = query.sorting || ''
  filterParams.value.page = Number(query.page)
}
