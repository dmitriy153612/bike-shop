<template>
  <page-structure :breadcrumbs="breadcrumbs">
    <div class="product-page" v-if="isProductLoaded">
      <section class="product-page__sec">
        <app-container class="product-page__container">
          <app-title class="product-page__title">
            {{ title }}
          </app-title>
          <app-swiper class="product-page__swiper" :images-urls="imagesUrls" :title="title" />
          <product-descr-box
            class="product-page__descr"
            :formatedBrandName="formatedBrandName"
            :formatedSizeName="formatedSizeName"
            :colorName="colorName"
            :price="price"
            :oldPrice="oldPrice"
            :showBtnSpinner="cartStore.isAddtoCartLoading"
            :sizes="sizes"
            v-model="sizeId"
            @add-to-cart="addToCart"
          />

          <product-info class="product-page__info" :info-list="productInfoData" />
        </app-container>
      </section>
    </div>

    <app-modal @close="closeErrorModal" v-if="isProductError">
      <confirm-form confirm-name="Ok" message="Товар не найден" @action="closeErrorModal" />
    </app-modal>
  </page-structure>
</template>

<script lang="ts" setup>
import PageStructure from '@/components/layouts/PageStructure.vue'
import AppTitle from '@/components/AppTitle.vue'
import AppContainer from '@/components/layouts/AppContainer.vue'
import AppSwiper from '@/components/AppSwiper.vue'
import AppModal from '@/components/modal/AppModal.vue'
import ConfirmForm from '@/components/modal/ConfirmForm.vue'
import ProductInfo from '@/components/product/ProductInfo.vue'
import ProductDescrBox from '@/components/product/ProductDescrBox.vue'
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

const isProductError = ref(false)

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

const breadcrumbs = computed(() => [
  {
    linkName: 'Каталог',
    pageName: 'catalog'
  },
  {
    linkName: title.value,
    pageName: 'product'
  }
])

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

function closeErrorModal() {
  isProductError.value = false
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

watch(
  () => productStore.error,
  (newValue) => {
    if (newValue) {
      isProductError.value = true
    } else {
      isProductError.value = false
    }
  }
)
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.product-page {
  &__container {
    display: grid;
    grid-template-columns: 0.7fr 0.3fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'swiper title'
      'swiper descr'
      'info info';
    column-gap: 30px;
    row-gap: 20px;

    @media #{$screen-huge} {
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto 1fr;
      grid-template-areas:
        'title title'
        'swiper descr'
        'info info';
    }

    @media #{$screen-medium} {
      grid-template-columns: 1fr;
      grid-template-areas:
        'title'
        'swiper'
        'descr'
        'info';
    }
  }

  &__swiper {
    grid-area: swiper;
    align-self: flex-start;
    aspect-ratio: 384 / 212;
    width: 100%;
    overflow: hidden;
  }

  &__title {
    grid-area: title;
    padding-bottom: 0px;

    @media #{$screen-medium} {
      justify-self: center;
    }
  }

  &__descr {
    grid-area: descr;
    align-self: flex-start;

    @media #{$screen-medium} {
      justify-self: center;
    }
  }

  &__info {
    grid-area: info;
  }
}
</style>
