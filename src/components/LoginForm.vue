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

    <button-submit
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
import ButtonSubmit from '@/components/ButtonSubmit.vue'
import AppInput from '@/components/AppInput.vue'
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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.user-form {
  display: grid;

  &__title {
    margin: 0;
    padding-bottom: 10px;
    font-weight: 400;
    color: $sunglow;
  }

  &__inputs {
    display: grid;
    gap: 26px;
    padding: 20px 0;
  }

  &__btn-submit {
    justify-self: flex-start;
  }

  &__account-btn {
    justify-self: flex-end;
    padding: 3px;
    border-color: transparent;
    font-size: 14px;
    color: $lochmara;
    background-color: transparent;
    cursor: pointer;
    font-weight: 600;
    transition-property: color, border-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
    outline: none;
  }

  &__account-btn:focus {
    border-color: lighten($lochmara, 20%);
  }

  @media #{$hover-min-width} {
    &__account-btn:hover {
      color: lighten($lochmara, 20%);
    }
  }

  &__account-btn:active {
    color: lighten($lochmara, 40%);
  }

  .app-input__input.focus + .app-input__label {
    color: $sunglow;
    background-color: transparent;
  }
}
</style>
