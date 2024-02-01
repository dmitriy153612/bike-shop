<template>
  <app-section class="cart-sec">
    <app-title class="cart-sec__title"> Корзина </app-title>
    <template v-if="!cartList.length && !cartStore.isGetCartLoading">
      <p class="order-message-text cart-sec__message">Корзина пуста</p>
    </template>
    <template v-if="cartList.length">
      <div class="cart-sec__selection">
        <app-checkbox
          v-model="isMainCheckboxSelected"
          class="cart-selection__checkbox"
          name="Выбрать всё"
          :value="true"
          @input-click="toggleAllCheckboxes"
        />
        <app-button-cross
          v-if="selectedCartItemsIds.length"
          name="Удалить выделенное"
          @click="openDeletionModal"
        />
      </div>
      <transition-group v-if="cartIdsIsSelected.length" name="list" tag="ul" class="cart-sec__list">
        <li v-for="(product, index) in cartList" :key="product.cartItemId" class="cart-list__item">
          <cart-product
            v-model="cartIdsIsSelected[index].selected"
            :product-cart-id="product.cartItemId"
            :product-id="product.productId"
            :picture-src="product.picture"
            :title="product.title"
            :color-name="product.color.name"
            :size-id="product.size._id"
            :size-name="product.size.name"
            :price="product.price"
            :price-for-one="product.priceForOne"
            :old-price="product?.oldPrice"
            :price-difference="product?.priceDifference"
            :amount="product.amount"
            :selected="product.selected"
          />
        </li>
      </transition-group>
      <aside class="cart-sec__aside">
        <cart-order-form
          v-if="!cartStore.isGetCartLoading"
          class="cart-sec__order-form"
          :amount="selectedAmount"
          :price-difference="priceDifference"
          :old-price="oldPrice"
          :price="totalPrice"
          :show-spinner="showFormSpinner"
        >
          <app-button-submit
            class="cart-sec__btn-submit"
            element-type="router-link"
            btn-name="Перейти к оформлению"
            :to="{ name: selectedCartItemsIds.length ? 'order' : null }"
            @click="openOrderModal"
          />
        </cart-order-form>
      </aside>

      <app-modal :show-modal="isDeletionModalOpen" @close-modal="closeDeletionModal">
        <confirm-form
          confirm-name="Удалить"
          cancel-name="Отмена"
          message="Удалить выбранные товары?"
          @close-modal="closeDeletionModal"
          @action="removeProducts"
        />
      </app-modal>

      <app-modal :show-modal="isOrderModalOpen" @close-modal="closeOrderModal">
        <confirm-form
          confirm-name="Ок"
          message="Выберите товары для оформления"
          @action="closeOrderModal"
        />
      </app-modal>
    </template>
  </app-section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import AppButtonCross from '@/components/UI/AppButtonCross.vue'
import AppSection from '@/components/common/AppSection.vue'
import AppTitle from '@/components/common/AppTitle.vue'
import CartProduct from '@/components/CartProduct.vue'
import AppModal from '@/components/common/AppModal.vue'
import ConfirmForm from '@/components/ConfirmForm.vue'
import CartOrderForm from '@/components/CartOrderForm.vue'
import AppButtonSubmit from '@/components/UI/AppButtonSubmit.vue'
import debounce from '@/helpers/debonce'
import { useCartStore } from '@/stores/cartStore'
import {
  type SelectedCartItem,
  type CartConfig,
  type CartProduct as CartProductObj
} from '@/interfaces/CartInterfaces'

const cartStore = useCartStore()

const isMainCheckboxSelected = ref(true)

const isDeletionModalOpen = ref(false)
const isOrderModalOpen = ref(false)

const cartIdsIsSelected = ref<SelectedCartItem[]>([])

const cartList = computed<CartProductObj[]>(() => cartStore.cartList)
const cartConfig = computed<CartConfig | null>(() => cartStore.cartConfig)
const selectedAmount = computed<number>(() =>
  cartConfig.value ? cartConfig.value.selectedAmount : 0
)
const priceDifference = computed<number | undefined>(() =>
  cartConfig.value ? cartConfig.value.totalPriceDifference : undefined
)
const oldPrice = computed<number | undefined>(() =>
  cartConfig.value ? cartConfig.value.totalOldPrice : undefined
)
const totalPrice = computed<number>(() => (cartConfig.value ? cartConfig.value.totalPrice : 0))

const selectedCartItemsIds = computed<string[]>(() => {
  return cartIdsIsSelected.value.filter((item) => item.selected).map((item) => item.cartItemId)
})

const showFormSpinner = computed(() => {
  return (
    cartStore.isSelectCartProductLoading > 0 ||
    cartStore.isSelectedCartItemAmountChanging > 0 ||
    cartStore.isCartRemoveLoading
  )
})

const debounceFetchSelectCartProducts = debounce(({ cartItemIds: newValue }) => {
  console.log(newValue)
  cartStore.fetchSelectCartProducts(newValue)
})

function watchSelectedProducts() {
  cartIdsIsSelected.value = getCartIdsIsSelected()
  watch(cartIdsIsSelected.value, (newValue) => {
    debounceFetchSelectCartProducts({ cartItemIds: newValue })
  })
}

async function loadCart(): Promise<void> {
  await cartStore.fetchGetCart()
  watchSelectedProducts()
}
loadCart()

function getCartIdsIsSelected(): SelectedCartItem[] {
  return cartList.value.map((product) => {
    return { cartItemId: product.cartItemId, selected: product.selected }
  })
}

function closeDeletionModal(): void {
  isDeletionModalOpen.value = false
}
function openDeletionModal(): void {
  isDeletionModalOpen.value = true
}

function closeOrderModal(): void {
  isOrderModalOpen.value = false
}
function openOrderModal(): void {
  const isSelectedProduct = cartIdsIsSelected.value.some((item) => item.selected)
  if (!isSelectedProduct) {
    isOrderModalOpen.value = true
  }
}
function toggleAllCheckboxes(): void {
  if (selectedCartItemsIds.value.length < cartList.value.length) {
    cartIdsIsSelected.value.forEach((item) => {
      item.selected = true
    })
  } else if (selectedCartItemsIds.value.length === cartList.value.length) {
    cartIdsIsSelected.value.forEach((item) => {
      item.selected = false
    })
  }
}

function toggleMainCheckbox(selectedCartItemsIds: string[]): void {
  if (selectedCartItemsIds.length === cartList.value.length) {
    isMainCheckboxSelected.value = true
  } else {
    isMainCheckboxSelected.value = false
  }
}

watch(
  () => selectedCartItemsIds.value,
  (newValue) => {
    toggleMainCheckbox(newValue)
  }
)

async function removeProducts() {
  closeDeletionModal()
  cartStore.removeCartItems(selectedCartItemsIds.value)
  await cartStore.fetchRemoveCart(selectedCartItemsIds.value)
  watchSelectedProducts()
}
</script>
@/interfaces/CartInterfaces
