<template>
  <div class="card">
    <router-link
      class="card__img-link"
      tabindex="-1"
      :to="{ name: 'product', params: { id }, query: { sizeId } }"
    >
      <div v-if="discount" class="card__discount">
        <svg class="card__discount-svg">
          <use xlink:href="#discount" />
        </svg>
        <span class="card__discount-percent">{{ discount }}%</span>
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
      <color-indicator :color-code="color.code" :color-name="color.name" />
    </div>
    <app-price class="card__price-box" :price="price" :old-price="oldPrice" />
    <button-submit
      class="card__btn"
      btn-name="В корзину"
      :show-spinner="showSpinner"
      @click="addToCart"
    >
      <svg>
        <use xlink:href="#cart" />
      </svg>
    </button-submit>
  </div>
</template>

<script lang="ts" setup>
import AppSizePicker from '@/components/UI/AppSizePicker.vue'
import ButtonSubmit from '@/components/UI/ButtonSubmit.vue'
import ColorIndicator from '@/components/ColorIndicator.vue'
import AppPrice from '@/components/AppPrice.vue'
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
    console.error(err)
  } finally {
    showSpinner.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.card {
  position: relative;
  border-radius: 15px;
  box-shadow: 0px 0px 9px 3px rgba($black, 0.32);
  backface-visibility: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 15px;
  padding: 20px;
  height: 100%;
  background-color: $white;
  transition-property: box-shadow, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &:focus-within {
    box-shadow: 0px 0px 9px 5px rgba($black, 0.5);
  }

  @media #{$hover-min-width} {
    &:hover {
      box-shadow: 0px 0px 2px 2px $sunglow;
    }
  }

  &__img {
    max-width: 100%;
    height: auto;
  }

  &__img-link {
    aspect-ratio: 310 / 176;
    overflow: hidden;
  }

  &__title {
    margin: 0;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    color: $black;
  }

  &__link {
    position: relative;
    display: block;
    max-width: max-content;
    width: 100%;
    text-decoration: none;
    outline: none;
    color: $black;
  }

  &__link:visited {
    color: $lochmara;
  }

  &__link::before {
    position: absolute;
    content: '';
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 2px solid transparent;
    transition:
      border-color 0.2s ease,
      bottom 0.2s ease;
  }

  &__link:focus::before {
    border-color: $grenadier;
    bottom: -5px;
  }

  &__link:hover::before {
    border-color: $sunglow;
    bottom: -5px;
  }

  &__link:active {
    color: $grenadier;
  }

  &__discount {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 50px;
    width: 50px;
  }

  &__discount-svg {
    width: 100%;
    height: 100%;
  }

  &__discount-percent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $grenadier;
    font-size: 100%;
  }

  &__btn {
    justify-self: center;
  }

  &__row {
    display: flex;
    justify-content: space-between;

    gap: 10px;
  }
}
</style>
