<template>
  <page-structure title="Корзина" :breadcrumbs="breadcrumbs">
    <div class="cart-page">
      <section class="cart-page__sec">
        <app-container class="cart-page__container">
          <template v-if="!cartList.length && !cartStore.isGetCartLoading">
            <p class="cart-page__message">Корзина пуста</p>
          </template>

          <template v-if="cartList.length">
            <div class="cart-page__selection">
              <app-checkbox
                v-model="isMainCheckboxSelected"
                name="Выбрать всё"
                :value="true"
                @input-click="toggleAllCheckboxes"
              />
              <button-cross
                class="cart-page__btn-cross"
                v-if="selectedCartItemsIds.length"
                name="Удалить выделенное"
                @click="openDeletionModal"
              />
            </div>
            <transition-group
              v-if="cartIdsIsSelected.length"
              name="list"
              tag="ul"
              class="cart-page__list"
            >
              <li
                v-for="(product, index) in cartList"
                :key="product.cartItemId"
                class="cart-list__item"
              >
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

            <div class="cart-page__right">
              <cart-order-form
                v-if="!cartStore.isGetCartLoading"
                class="cart-page__order-form"
                :amount="selectedAmount"
                :price-difference="priceDifference"
                :old-price="oldPrice"
                :price="totalPrice"
                :show-spinner="showFormSpinner"
              >
                <button-submit
                  class="cart-page__btn-submit"
                  element-type="router-link"
                  btn-name="Оформить"
                  :to="{ name: selectedCartItemsIds.length ? 'order' : null }"
                  @click="openOrderModal"
                />
              </cart-order-form>
            </div>

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
        </app-container>
      </section>
    </div>
  </page-structure>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { lockScroll } from '@/helpers/lockScroll'
import PageStructure from '@/components/PageStructure.vue'
import AppCheckbox from '@/components/AppCheckbox.vue'
import ButtonCross from '@/components/ButtonCross.vue'
import AppContainer from '@/components/AppContainer.vue'
import CartProduct from '@/components/CartProduct.vue'
import AppModal from '@/components/AppModal.vue'
import ConfirmForm from '@/components/ConfirmForm.vue'
import CartOrderForm from '@/components/CartOrderForm.vue'
import ButtonSubmit from '@/components/ButtonSubmit.vue'
import debounce from '@/helpers/debonce'
import { useCartStore } from '@/stores/cartStore'
import {
  type SelectedCartItem,
  type CartConfig,
  type CartProduct as CartProductObj
} from '@/interfaces/CartInterfaces'

const breadcrumbs = ref([
  {
    linkName: 'Каталог',
    pageName: 'catalog'
  },
  {
    linkName: 'Корзина',
    pageName: 'cart'
  }
])

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

async function removeProducts() {
  closeDeletionModal()
  cartStore.removeCartItems(selectedCartItemsIds.value)
  await cartStore.fetchRemoveCart(selectedCartItemsIds.value)
  watchSelectedProducts()
}

watch(
  () => selectedCartItemsIds.value,
  (newValue) => {
    toggleMainCheckbox(newValue)
  }
)

watch(
  () => isOrderModalOpen.value,
  (newValue) => {
    lockScroll(newValue)
  }
)
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.cart-page {
  &__container {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 25px;

    @media #{$screen-medium} {
      grid-template-columns: 1fr;
    }
  }

  &__title {
    grid-column: 1 / 3;

    @media #{$screen-medium} {
      grid-column: 1;
    }
  }

  &__btn-cross {
    margin-top: -1px;
    margin-bottom: -1px;
  }

  &__message {
    justify-self: center;
  }

  &__selection {
    position: sticky;
    top: 55px;
    z-index: 3;
    grid-column: 1 / 3;
    display: flex;
    align-items: center;
    column-gap: 25px;
    margin-bottom: 40px;
    padding-top: 6px;
    padding-bottom: 6px;
    background-color: $white;
    box-shadow: 0 0 0 100vmax $white;
    clip-path: inset(0 -100vmax);

    @media #{$screen-medium} {
      grid-column: 1;
    }
  }

  &__list {
    grid-column: 1 / 2;
    display: grid;
    row-gap: 25px;

    @media #{$screen-medium} {
      grid-column: 1;
      margin-bottom: 30px;
    }
  }

  &__right {
    @media #{$screen-medium} {
      grid-column: 1;
      justify-self: center;
    }
  }

  &__order-form {
    position: sticky;
    top: 120px;
  }
}
</style>
