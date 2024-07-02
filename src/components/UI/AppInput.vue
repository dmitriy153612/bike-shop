<template>
  <div
    class="app-input"
    :class="{
      'app-input--error': error,
      'app-input--focus': isInputFocused || modelValue,
      'app-input--currency': inputType === 'currency',
      'app-input--password': inputType === 'password'
    }"
  >
    <div class="app-input__inner">
      <input
        ref="inputEl"
        :id="uniqId('input')"
        class="app-input__input"
        v-model="localValue"
        :type="type"
        :inputType="inputType"
        :disabled="disabled"
        @focus="focusInput"
        @blur="unFocusInput"
        @input="removeError"
      />
      <label :for="uniqId('input')" class="app-input__label">
        {{ label }}
        <span v-if="required" class="app-input__label-star">*</span>
      </label>
      <button
        v-if="inputType === 'password'"
        type="button"
        class="app-input__eye-btn"
        @click.prevent="showPassword = !showPassword"
      >
        <svg :class="{ show: showPassword }">
          <use xlink:href="#eye" />
        </svg>
      </button>
    </div>
    <span class="app-input__error">{{ error }}</span>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, computed, onMounted } from 'vue'
import getUniqueId from '@/helpers/getUniqueId'

enum InputTypes {
  numeric = 'numeric',
  currency = 'currency',
  email = 'email',
  password = 'password',
  tel = 'tel',
  text = 'text'
}

type Format = {
  [InputTypes.numeric]: (value: string) => { formatedEmitValue: number; formatedLocalValue: string }
  [InputTypes.currency]: (value: string) => {
    formatedEmitValue: number
    formatedLocalValue: string
  }
  [InputTypes.tel]: (value: string) => { formatedEmitValue: string; formatedLocalValue: string }
}

const props = defineProps({
  label: { type: String, default: null },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  inputType: {
    type: String as () => keyof typeof InputTypes,
    default: 'text' as InputTypes.text
  },
  telMsk: { type: String, default: '+7 (###) ### ## ##' },
  error: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  focus: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'removeError'])

const isInputFocused = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const localValue = ref<string>('')

const inputEl = ref<HTMLInputElement | null>(null)

const type = computed(() => {
  if (props.inputType === InputTypes.password && !showPassword.value) {
    return InputTypes.password
  }
  if (props.inputType === InputTypes.tel) {
    return InputTypes.tel
  }
  return InputTypes.text
})

const uniqId = getUniqueId()

function removeError() {
  emit('removeError')
}

const format: Format = {
  numeric: (value) => ({
    formatedEmitValue: Number(toNumericString(value)),
    formatedLocalValue: toNumericString(value)
  }),
  currency: (value) => ({
    formatedEmitValue: Number(toNumericString(value)),
    formatedLocalValue: toCurrencyString(value)
  }),
  tel: (value) => ({
    formatedEmitValue: toNumericString(value),
    formatedLocalValue: toTelMask(value)
  })
}

function toNumericString(value: string): string {
  return value.toString().replace(/\D/g, '')
}

function toCurrencyString(value: string): string {
  return Number(toNumericString(value)).toLocaleString().replace(/^0+/, '')
}

function toTelMask(value: string): string {
  const CHAR = '#'
  const mask = props.telMsk
  const maskedArr = mask.split('')
  const numericValueArr = toNumericString(value).split('')

  if (numericValueArr[0] === '7') {
    numericValueArr.shift()
  }

  if (numericValueArr[0] === '8') {
    numericValueArr.shift()
  }

  numericValueArr.forEach((num) => {
    const maskIndex = maskedArr.findIndex((char) => char === CHAR)

    if (maskIndex > -1) {
      maskedArr[maskIndex] = num
    }
  })

  const reversedMaskArr = [...maskedArr].reverse()

  const lastNumberIndex = reversedMaskArr.findIndex((char) => !isNaN(parseInt(char)))
  const maskedString = reversedMaskArr.slice(lastNumberIndex).reverse().join('')

  return maskedString
}

function formatEmitValue(value: string, inputType: keyof typeof InputTypes) {
  if (inputType in format) {
    return format[inputType as keyof Format](value)
  }

  return {
    formatedEmitValue: value,
    formatedLocalValue: value
  }
}

function focusInput(): void {
  isInputFocused.value = true
}
function unFocusInput(): void {
  isInputFocused.value = false
}

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue.toString()
  },
  { immediate: true }
)

watch(
  () => localValue.value,
  (newValue) => {
    const { formatedLocalValue, formatedEmitValue } = formatEmitValue(newValue, props.inputType)
    localValue.value = formatedLocalValue
    emit('update:modelValue', formatedEmitValue)
  }
)

onMounted(() => {
  if (props.focus && inputEl.value) {
    inputEl.value.focus()
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.app-input {
  &--focus & {
    &__input {
      border-color: $sunglow;
    }

    &__label {
      top: -8px;
      left: 8px;
      color: $sunglow;
      font-size: 12px;

      width: max-content;
    }
  }

  &--currency & {
    &__input {
      text-align: right;
    }
  }

  &--password & {
    &__input {
      padding-right: 20px;
    }
  }

  &--error & {
    &__input {
      border-color: $grenadier;
    }

    &__error {
      display: block;
      padding-left: 8px;
    }
  }

  &__inner {
    position: relative;
  }

  &__input {
    border: 2px solid $alto;
    padding: 6px;
    width: 100%;
    outline: none;
    overflow-x: hidden;
    font-size: 20px;
  }

  &__label {
    position: absolute;
    top: 50%;
    right: 0;
    left: 8px;
    transform: translateY(-50%);
    line-height: 100%;
    color: $boulder;
    pointer-events: none;
    background-color: transparent;
    transition-property: color, top, left, font-size;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  &__label-star {
    position: absolute;
    color: $grenadier;
    font-size: 1.4em;
  }

  &__input:disabled {
    color: $boulder;
    font-weight: 600;
    cursor: not-allowed;
  }

  &__eye-btn {
    position: absolute;
    top: 50%;
    right: 5px;
    border: none;
    display: flex;
    padding: 0;
    transform: translateY(-50%);
    background-color: transparent;
    cursor: pointer;

    &:focus-visible,
    &:hover {
      outline: 1px solid $lochmara;
    }

    & svg {
      width: 14px;
      height: 14px;
      width: 0.8em;
      height: 0.8em;
      stroke: $boulder;
      transition: stroke 0.2s ease;
    }

    & svg.show {
      stroke: $black;
    }
  }

  &__error {
    display: none;
    padding-top: 2px;
    font-size: 12px;
    line-height: 100%;
    color: $grenadier;
  }
}
</style>
