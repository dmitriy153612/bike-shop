<template>
  <header class="header">
    <app-container>
      <div class="header__inner">
        <button
          class="header__btn-filter"
          id="btn-filter"
          v-if="route.name === 'catalog'"
          aria-label="Открыть фильтр товаров"
          @click.prevent="openFilter"
        >
          <svg class="icon">
            <use xlink:href="#filter" />
          </svg>
        </button>
        <router-link class="header__catalog-link" :to="{ name: 'catalog', query: { page: 1 } }">
          Bike-Shop
        </router-link>
        <app-logo class="header__logo" />

        <div class="header__user-links">
          <header-login-btn svg-id="#user" :btn-text="btnLoginText" @click.prevent="openModal" />
          <header-cart-link v-if="token" :amount="cartAmount" />
        </div>
      </div>
    </app-container>
  </header>
  <teleport to="body">
    <transition name="appear">
      <app-modal @close="closeModal" v-if="isLoginModalOpen">
        <the-login-form />
      </app-modal>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import AppContainer from '@/components/layouts/AppContainer.vue'
import AppLogo from '@/components/AppLogo.vue'
import HeaderLoginBtn from '@/components/header/HeaderLoginBtn.vue'
import HeaderCartLink from '@/components/header/HeaderCartLink.vue'
import AppModal from '@/components/modal/AppModal.vue'
import TheLoginForm from '@/components/modal/TheLoginForm.vue'
import { useLoginStore } from '@/stores/loginStore'
import { useCartStore } from '@/stores/cartStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useRoute } from 'vue-router'

const loginStore = useLoginStore()
const cartStore = useCartStore()
const globalStore = useGlobalStore()

const token = computed<string>(() => loginStore.token)
const cartAmount = computed<number>(() => cartStore.cartAmount)
const isLoginModalOpen = computed<boolean>(() => globalStore.isLoginModalOpen)

const btnLoginText: ComputedRef<'Выйти' | 'Войти'> = computed(() =>
  token.value ? 'Выйти' : 'Войти'
)

const route = useRoute()

loginStore.setUserDataFromLS()

function closeModal(): void {
  globalStore.openLoginModal(false)
}

function openModal(e: Event): void {
  globalStore.openLoginModal(true, e)
}

function openFilter(e: Event) {
  globalStore.toggleFilter(e)
}
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.header {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;

  max-width: 100wv;
  background-color: $black;

  padding-left: calc(100vw - 100%);
  margin-right: 0;

  @media #{$screen-huge} {
    padding-right: 0;
  }

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    height: 100%;
  }

  &__catalog-link {
    display: flex;
    border: 1px solid transparent;
    padding: 1px 4px;
    font-weight: 600;
    font-size: 20px;
    color: $sunglow;
    transition-property: border-color, color;
    transition-duration: 0.2s;
    transition-timing-function: ease;

    @media #{$screen-huge} {
      display: none;
    }
  }

  &__catalog-link:focus {
    outline: none;
    border-color: $sunglow;
  }

  @media #{$hover-min-width} {
    &__catalog-link:hover {
      color: $sunglowLighten;
    }
  }

  &__btn-filter {
    display: none;

    @media #{$screen-huge} {
      display: flex;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 2px;
      background-color: $black;
      transition-property: box-shadow, border-color;
      transition-duration: 0.2s;
      transition-timing-function: ease;

      & svg {
        height: 30px;
        width: 30px;
        stroke: $sunglow;
        transition: stroke 0.2s ease;
      }

      &:focus {
        outline: none;
        border-color: $sunglow;
        box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 1);
      }

      &:active svg {
        stroke: $grenadier;
      }
    }
  }

  &__user-links {
    display: flex;
    gap: 5px;
  }
}
</style>
