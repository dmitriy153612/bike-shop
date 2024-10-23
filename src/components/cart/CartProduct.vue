<template>
  <div class="cart-product order">
    <app-checkbox
      v-model="updatedIsProductSelected"
      class="cart-product__checkbox"
      :value="productCartId"
    />
    <router-link
      class="cart-product__link"
      :to="{
        name: 'product',
        params: { id: productId },
        query: { sizeId }
      }"
    >
      <img class="cart-product__img" loading="lazy" :src="pictureSrc" :alt="title" />
    </router-link>

    <h2 class="cart-product__title">
      {{ title }}
    </h2>
    <div class="cart-product__attrs">
      <option-descr option-name="Размер" :option-value="sizeName" />
      <option-descr option-name="Цвет" :option-value="colorName" />
    </div>

    <app-counter
      class="cart-product__counter"
      :price-for-one="priceForOne"
      :amount="amount"
      @amount="updateAmount"
    />
    <app-price class="cart-product__price" :price="price" :old-price="oldPrice" />
    <option-descr
      v-if="priceDifference"
      class="cart-product__discount"
      option-name="Скидка"
      :currency="true"
      :negative="true"
      :red-value="true"
      :option-value="priceDifference"
    />
    <transition name="appear">
      <app-spinner v-if="showSpinner" class="cart-product__spinner" type="card" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import AppCounter from '@/components/AppCounter.vue'
import AppPrice from '@/components/AppPrice.vue'
import OptionDescr from '@/components/OptionDescr.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import debounce from '@/helpers/debonce'
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  productCartId: { type: String, required: true },
  productId: { type: String, required: true },
  sizeId: { type: String, required: true },
  pictureSrc: { type: String, required: true },
  title: { type: String, required: true },
  colorName: { type: String, required: true },
  sizeName: { type: String, required: true },
  price: { type: Number, required: true },
  priceForOne: { type: Number, required: true },
  amount: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  priceDifference: { type: Number, default: null },
  orderType: { type: Boolean, default: false },
  selected: { type: Boolean, required: true }
})

const cartStore = useCartStore()

const showSpinner = ref<boolean>(false)

const updatedIsProductSelected = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})

const startDebounce = debounce(fetchAmount, 250)

function updateAmount(newAmount: number): void {
  if (showSpinner.value) {
    return
  }
  cartStore.updateCartItemAmount(props.productCartId, newAmount)
  startDebounce(newAmount)
}

async function fetchAmount(): Promise<void> {
  try {
    cartStore.updateIsCartItemAmountChanging(1)
    if (props.selected) {
      cartStore.updateIsSelectedCartItemAmountChanging(1)
    }
    showSpinner.value = true

    await cartStore.fetchChangeCartItemAmount()
  } catch (err) {
    console.error(err)
  } finally {
    showSpinner.value = false
    if (props.selected) {
      cartStore.updateIsSelectedCartItemAmountChanging(-1)
    }
    cartStore.updateIsCartItemAmountChanging(-1)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

@media #{$screen-small} {
  .cart-product {
    &__counter {
      justify-self: center;
    }
  }
}

.cart-product {
  position: relative;
  display: grid;
  gap: 15px;
  grid-template-areas:
    'checkbox link title counter price'
    'checkbox link attrs discount discount';
  grid-template-columns: 30px minmax(180px, 300px) minmax(200px, 1fr) max-content 114px;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 9px 3px rgba($black, 0.32);
  transition: box-shadow 0.2s ease;

  &:focus-within {
    box-shadow: 0px 0px 9px 5px rgba($black, 0.5);
  }

  @media #{$hover-min-width} {
    &:hover {
      box-shadow: 0px 0px 5px 2px rgba($black, 0.32);
    }
  }

  @media #{$screen-huge} {
    grid-template-areas:
      'checkbox title price'
      'checkbox link counter'
      'checkbox link attrs'
      'checkbox link discount';
    grid-template-columns: 22px minmax(180px, 410px) minmax(144px, 1fr);
    grid-template-rows: auto auto auto 1fr;
  }

  @media #{$screen-medium} {
    position: relative;
    grid-template-columns: minmax(180px, 210px) minmax(144px, 1fr);
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      'link title price'
      'link attrs counter '
      'link discount discount ';
    padding: 12px;
  }

  @media #{$screen-small} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto 1fr;
    grid-template-areas:
      'title title'
      'link link'
      'price attrs'
      'counter counter'
      'discount discount ';
    gap: 4px;
  }

  &__checkbox {
    grid-area: checkbox;
    align-self: center;
    height: 16px;
    width: 16px;

    @media #{$screen-medium} {
      position: absolute;
      top: 12px;
      left: 12px;
    }
  }

  &__link {
    grid-area: link;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    height: 100%;
    overflow-y: hidden;
    outline: 1px solid transparent;
    transition: outline 0.2s ease;
    aspect-ratio: 300 / 170;

    @media #{$screen-huge} {
      max-height: 120px;
    }

    @media #{$screen-small} {
      justify-self: center;
      max-height: 140px;
    }
  }

  &__link:focus {
    outline-color: $sunglow;
  }

  &__img {
    display: block;
    object-fit: contain;
    max-height: 100%;
    max-width: 100%;
    width: 100%;
  }

  &__title {
    grid-area: title;
    margin: 0;

    @media #{$screen-huge} {
      font-size: 20px;
    }

    @media #{$screen-small} {
      justify-self: center;
      padding-left: 30px;
    }
  }

  &__attrs {
    grid-area: attrs;
    align-self: flex-end;
    display: grid;
    max-width: 100%;

    @media #{$screen-small} {
      justify-self: center;
      align-self: flex-start;
    }
  }

  &__counter {
    grid-area: counter;

    @media #{$screen-small} {
      justify-self: center;
    }
  }

  &__price {
    grid-area: price;
    display: grid;

    @media #{$screen-small} {
      justify-self: center;
    }
  }

  &__discount {
    grid-area: discount;
    justify-self: flex-end;
    align-self: flex-end;
    width: fit-content;
  }

  &__discount .option-descr__value {
    color: $grenadier;
  }

  &__spinner {
    position: absolute;
  }
}
</style>
