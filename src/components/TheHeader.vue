<template>
  <div class="header-wrapper">
    <header class="section header">
      <div class="header__inner">
        <router-link
          v-show="route.name != 'catalog'"
          class="header__catalog-link"
          :to="{ name: 'catalog' }"
        >
          Каталог
        </router-link>
        <app-logo class="header__logo" />

        <div class="header__user-links">
          <app-login-btn
            ref="loginBtnComponentRef"
            svg-id="#user"
            :btn-text="btnLoginText"
            @click.prevent="openModal"
          />
          <app-cart-link v-if="token" :amount="cartAmount" />
        </div>
      </div>
    </header>
    <app-modal
      :btn-open-modal="loginBtnElem"
      :show-modal="isLoginModalOpen"
      @close-modal="closeModal"
    >
      <the-login-form />
    </app-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import AppLogo from '@/components/UI/AppLogo.vue'
import AppLoginBtn from '@/components/UI/AppLoginBtn.vue'
import AppCartLink from '@/components/UI/AppCartLink.vue'
import AppModal from '@/components/common/AppModal.vue'
import TheLoginForm from '@/components/TheLoginForm.vue'
import { useLoginStore } from '@/stores/loginStore'
import { useCartStore } from '@/stores/cartStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useRoute } from 'vue-router'

const loginStore = useLoginStore()
const cartStore = useCartStore()
const globalStore = useGlobalStore()

const loginBtnComponentRef: Ref<{ element: HTMLButtonElement | null }> = ref({
  element: null
})

const loginBtnElem = computed<HTMLButtonElement | null>(() => loginBtnComponentRef.value.element)

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
function openModal(): void {
  globalStore.openLoginModal(true)
}
</script>
