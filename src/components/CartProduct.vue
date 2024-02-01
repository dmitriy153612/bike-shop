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
      <app-option-descr class="cart-product__descr" option-name="Размер" :option-value="sizeName" />
      <app-option-descr class="cart-product__descr" option-name="Цвет" :option-value="colorName" />
    </div>

    <app-counter
      class="cart-product__counter"
      :price-for-one="priceForOne"
      :amount="amount"
      @amount="updateAmount"
    />
    <app-price class="cart-product__price" :price="price" :old-price="oldPrice" />
    <app-option-descr
      v-if="priceDifference"
      class="cart-product__descr cart-product__discount"
      option-name="Скидка"
      :currency="true"
      :negative="true"
      :option-value="priceDifference"
    />
    <transition name="appear">
      <app-spinner v-if="showSpinner" class="cart-product__spinner" type="card" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import AppCounter from '@/components/UI/AppCounter.vue'
import AppPrice from '@/components/common/AppPrice.vue'
import AppOptionDescr from '@/components/common/AppOptionDescr.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
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
    console.log(err)
  } finally {
    showSpinner.value = false
    if (props.selected) {
      cartStore.updateIsSelectedCartItemAmountChanging(-1)
    }
    cartStore.updateIsCartItemAmountChanging(-1)
  }
}
</script>
