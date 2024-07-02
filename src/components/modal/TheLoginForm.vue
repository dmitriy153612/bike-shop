<template>
  <transition name="flip" mode="out-in">
    <login-form v-if="showLoginForm && !token" @show-registration-form="toggleForm" />

    <registration-form v-else-if="!showLoginForm && !token" @show-login-form="toggleForm" />

    <confirm-form
      v-else-if="token"
      confirm-name="Ok"
      cancel-name="Отмена"
      message="Выйти из аккаунта?"
      @close="closeModal"
      @action="logout"
    />
  </transition>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/modal/LoginForm.vue'
import RegistrationForm from '@/components/modal/RegistrationForm.vue'
import ConfirmForm from '@/components/modal/ConfirmForm.vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/loginStore'
import { useGlobalStore } from '@/stores/globalStore'
import { ref, computed } from 'vue'

const loginStore = useLoginStore()
const globalStore = useGlobalStore()
const router = useRouter()
const route = useRoute()
const showLoginForm = ref<boolean>(true)

const token = computed<string>(() => loginStore.token)

function toggleForm(value: boolean): void {
  showLoginForm.value = value
}
function closeModal(): void {
  globalStore.openLoginModal(false)
}
function logout() {
  loginStore.logout()
  closeModal()
  if (route.name != 'catalog') {
    router.push({ name: 'catalog' })
  }
}
</script>
