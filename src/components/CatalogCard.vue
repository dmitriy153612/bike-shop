<template>
  <div class="card">
    <router-link
      class="card__img-link"
      tabindex="-1"
      :to="{ name: 'product', params: { id }, query: { sizeId } }"
    >
      <div v-if="discount" class="discount card__discount">
        <svg class="discount__svg">
          <use xlink:href="#discount" />
        </svg>
        <span class="discount__percent">{{ discount }}%</span>
      </div>
      <img class="card__img" loading="lazy" :src="img" :alt="title" />
    </router-link>
    <h2 class="card__title">
      <router-link class="card__link" :to="{ name: 'product', params: { id }, query: { sizeId } }">
        {{ title }}
      </router-link>
    </h2>

    <div class="card__row">
      <app-size-picker v-model="sizeId" :sizes="sizes" />
      <app-color-indicator :color-code="color.code" :color-name="color.name" />
    </div>
    <app-price class="card__price-box" :price="price" :old-price="oldPrice" />
    <app-button-submit
      class="card__btn"
      btn-name="В корзину"
      :show-spinner="showSpinner"
      @click="addToCart"
    >
      <svg><use xlink:href="#cart" /></svg>
    </app-button-submit>
  </div>
</template>

<script lang="ts" setup>
import AppSizePicker from '@/components/UI/AppSizePicker.vue'
import AppButtonSubmit from '@/components/UI/AppButtonSubmit.vue'
import AppColorIndicator from '@/components/common/AppColorIndicator.vue'
import AppPrice from '@/components/common/AppPrice.vue'
import { useCartStore } from '@/stores/cartStore'
import { type PropType, ref } from 'vue'
import { type Size, type Color } from '@/interfaces/CatalogInterfaces'

const props = defineProps({
  id: { type: String, required: true },
  discount: { type: Number, default: null },
  title: { type: String, required: true },
  sizes: { type: Array as PropType<Size[]>, required: true },
  color: { type: Object as PropType<Color>, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  img: { type: String, required: true }
})

const cartStore = useCartStore()

const sizeId = ref<string>(props.sizes[0] ? props.sizes[0]._id : '')

const showSpinner = ref<boolean>(false)

async function addToCart(): Promise<void> {
  try {
    showSpinner.value = true
    await cartStore.fetchAddToCart({
      productId: props.id,
      sizeId: sizeId.value,
      amount: 1
    })
  } catch (err) {
    console.log(err)
  } finally {
    showSpinner.value = false
  }
}
</script>
