<template>
  <transition name="appear">
    <app-section v-if="isProductLoaded" class="product-sec">
      <app-swiper class="product-sec__swiper" :images-urls="imagesUrls" :title="title" />
      <app-title class="product-sec__title">
        {{ title }}
      </app-title>
      <div class="product-descr-box product-sec__descr">
        <app-option-descr
          class="product-descr-box__brand"
          option-name="Брэнд"
          :option-value="formatedBrandName"
        />
        <app-option-descr
          class="product-descr-box__size"
          option-name="Размер"
          :option-value="formatedSizeName"
        />
        <app-option-descr
          class="product-descr-box__color"
          option-name="Цвет"
          :option-value="colorName"
        />
        <div class="product-descr-box__price-box">
          <h2 class="product-descr-box__price-title">Цена:</h2>
          <app-price :price="price" :old-price="oldPrice" />
        </div>
        <app-size-picker v-model="sizeId" class="product-descr-box__size-picker" :sizes="sizes" />
        <app-button-submit
          class="product-descr-box__btn"
          :show-spinner="cartStore.isAddtoCartLoading"
          btn-name="В корзину"
          @click="addToCart"
        >
          <svg><use xlink:href="#cart" /></svg>
        </app-button-submit>
      </div>

      <product-info class="product-sec__info" :info-list="productInfoData" />
    </app-section>
  </transition>
</template>

<script lang="ts" setup>
import AppTitle from '@/components/common/AppTitle.vue'
import AppSection from '@/components/common/AppSection.vue'
import AppSwiper from '@/components/UI/AppSwiper.vue'
import AppSizePicker from '@/components/UI/AppSizePicker.vue'
import AppPrice from '@/components/common/AppPrice.vue'
import AppButtonSubmit from '@/components/UI/AppButtonSubmit.vue'
import AppOptionDescr from '@/components/common/AppOptionDescr.vue'
import ProductInfo from '@/components/ProductInfo.vue'
import { useProductStore } from '@/stores/productStore'
import { ref, watch, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { type Size } from '@/interfaces/CatalogInterfaces'
import {
  type ProductDetail,
  type ProductInfo as ProductInfoInterface
} from '@/interfaces/ProductInterfaces'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const productId = ref<string>(route.params['id'] as string)
const sizeId = ref<string>('')

const product = computed<ProductDetail | null>(() => productStore.product)

const isProductLoaded = computed<boolean>(() => {
  if (product.value && product.value._id === productId.value) {
    return true
  }
  return false
})

const imagesUrls = computed<string[]>(() => (product.value ? product.value.pictures : []))
const title = computed<string>(() => (product.value ? product.value.title : ''))
const formatedBrandName = computed<string>(() => {
  const string = product.value ? product.value.brand?.name : null
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  return ''
})
const colorName = computed<string>(() => (product.value ? product.value.color?.name : ''))
const sizes = computed<Size[]>(() => (product.value ? product.value.sizes : []))
const price = computed<number>(() => (product.value ? product.value.price : 0))
const oldPrice = computed<number | undefined>(() =>
  product.value ? product.value.oldPrice : undefined
)
const productInfoData = computed<ProductInfoInterface[]>(() =>
  product.value ? product.value.info : []
)
const formatedSizeName = computed<string>(() => {
  if (sizes.value) {
    const sizeObj: Size | undefined = sizes.value.find((size) => size._id === sizeId.value)
    return sizeObj?.name.toUpperCase() || sizes.value[0]?.name.toUpperCase()
  }
  return ''
})

const isQuerySizeIdExist = computed<boolean>(() =>
  sizes.value ? sizes.value.some((sizeObj) => sizeObj._id === route.query['sizeId']) : false
)

productStore.fetchData({ id: productId.value })

async function addToCart(): Promise<void> {
  await cartStore.fetchAddToCart({
    productId: productId.value,
    sizeId: sizeId.value,
    amount: 1
  })
}

watchEffect(() => {
  if (isProductLoaded.value) {
    if (!isQuerySizeIdExist.value && sizes.value && sizes.value[0]) {
      sizeId.value = sizes.value[0]._id
      router.replace({ query: { ...route.query, sizeId: sizes.value[0]._id } })
    } else {
      sizeId.value = route.query['sizeId'] as string
    }
  }
})

watch(
  () => sizeId.value,
  (newValue) => {
    router.replace({ query: { ...route.query, sizeId: newValue } })
  }
)

watch(
  () => route.params['id'],
  (newValue) => {
    if (newValue) {
      productStore.fetchData({ id: newValue as string })
    }
  }
)
</script>
@/interfaces/ProductInterfaces
