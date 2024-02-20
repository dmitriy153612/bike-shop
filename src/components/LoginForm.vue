<template>
  <form class="user-form">
    <h3 v-if="!isRegistrationSuccess" class="user-form__title">Авторизация</h3>
    <h3 v-if="isRegistrationSuccess" class="user-form__title">
      Авторизация прошла успешно!
      <br />
      Авторизируйтесь, чтобы войти.
    </h3>
    <div class="user-form__inputs">
      <app-input
        ref="emailinputEl"
        v-model="email"
        class="user-form__input"
        input-type="email"
        label="Введите Email"
        :error="emailError"
        @remove-error="emailError = ''"
      />
      <app-input
        v-model="password"
        class="user-form__input"
        input-type="password"
        label="Введите пароль"
        :error="passwordError"
        @remove-error="passwordError = ''"
      />
    </div>

    <app-button-submit
      class="user-form__btn-submit"
      btn-name="Войти"
      :showSpinner="loginStore.isLoginLoading"
      @click.prevent="login"
    />
    <button class="user-form__account-btn" @click.prevent="showRegistrationForm">
      Регистрация
    </button>
  </form>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted, type Ref } from 'vue'
import AppButtonSubmit from '@/components/UI/AppButtonSubmit.vue'
import AppInput from '@/components/UI/AppInput.vue'
import { useLoginStore } from '@/stores/loginStore'
import { useRegistrationStore } from '@/stores/registrationStore'
import { useGlobalStore } from '@/stores/globalStore'
import validateEmail from '@/helpers/validateEmail'
import validatePassword from '@/helpers/validatePassword'

const emit = defineEmits(['showRegistrationForm'])

const isRegistrationSuccess = computed<boolean>(() => registrationStore.registrationSuccess)

const email = ref<string>('')
const password = ref<string>('')

const emailError = ref<string>('')
const passwordError = ref<string>('')

const emailinputEl: Ref<{ element: HTMLElement | null } | null> = ref(null)

const registrationStore = useRegistrationStore()
const loginStore = useLoginStore()
const globalStore = useGlobalStore()

async function login(): Promise<void> {
  validateEmail(email.value, emailError)
  validatePassword(password.value, passwordError)

  if (emailError.value || passwordError.value) {
    return
  }
  await loginStore.fetchLogin({
    email: email.value.toLowerCase(),
    password: password.value
  })

  if (loginStore.token) {
    closeModal()
  } else {
    if (loginStore.error?.response?.statusText === 'Not Found') {
      emailError.value = 'Неверный Email или пароль'
      passwordError.value = 'Неверный Email или пароль'
    }
  }
}

function closeModal() {
  globalStore.openLoginModal(false)
}

function showRegistrationForm() {
  emit('showRegistrationForm', false)
}

onMounted(() => {
  if (emailinputEl.value && emailinputEl.value.element) {
    emailinputEl.value.element.focus()
  }
})

onUnmounted(() => {
  registrationStore.toggleRegistrationSuccess(false)
})
</script>
