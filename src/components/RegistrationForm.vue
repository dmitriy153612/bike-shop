<template>
  <form class="user-form">
    <h3 class="user-form__title">Регистрация</h3>
    <div class="user-form__inputs">
      <app-input
        ref="emailInputEl"
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
      <app-input
        v-model="passwordConfirm"
        class="user-form__input"
        input-type="password"
        label="Подтвердите пароль"
        :error="passwordConfirmError"
        @remove-error="passwordConfirmError = ''"
      />
    </div>

    <button-submit
      class="user-form__btn-submit"
      btn-name="Зарегестрироваться"
      :showSpinner="registrationStore.isLoading"
      @click.prevent="register"
    />

    <button class="user-form__account-btn" @click.prevent="showLoginForm">Авторизация</button>
  </form>
</template>

<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue'
import ButtonSubmit from '@/components/ButtonSubmit.vue'
import AppInput from '@/components/AppInput.vue'
import { useRegistrationStore } from '@/stores/registrationStore'
import validateEmail from '@/helpers/validateEmail'
import validatePassword from '@/helpers/validatePassword'

const emit = defineEmits(['showLoginForm'])

const registrationStore = useRegistrationStore()

const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')

const emailInputEl: Ref<{ element: HTMLElement | null } | null> = ref(null)

const emailError = ref<string>('')
const passwordError = ref<string>('')
const passwordConfirmError = ref<string>('')

function validatePasswordConfirm(passwordConfirm: string, password: string): void {
  if (!passwordError.value && passwordConfirm != password) {
    passwordConfirmError.value = 'Пароли не совпадают'
  } else {
    passwordConfirmError.value = ''
  }
}

async function register(): Promise<void> {
  validateEmail(email.value, emailError)
  validatePassword(password.value, passwordError)
  validatePasswordConfirm(passwordConfirm.value, password.value)

  if (emailError.value || passwordError.value || passwordConfirmError.value) {
    return
  }
  await registrationStore.fetchData({
    email: email.value.toLowerCase(),
    password: password.value,
    passwordConfirm: passwordConfirm.value
  })

  if (registrationStore.error) {
    if (registrationStore.error?.response?.data === 'Email is already in use') {
      emailError.value = 'Данный Email уже зарегестрирован'
    }
  } else {
    email.value = ''
    password.value = ''
    passwordConfirm.value = ''

    showLoginForm()
  }
}

function showLoginForm() {
  emit('showLoginForm', true)
}

onMounted(() => {
  if (emailInputEl.value && emailInputEl.value.element) {
    emailInputEl.value.element.focus()
  }
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
