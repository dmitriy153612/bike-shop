<template>
  <div
    class="app-input"
    :class="{
      'app-input--error': error,
      'app-input--focus': isInputFocused || modelValue,
      'app-input--number': inputType === 'number',
      'app-input--password': inputType === 'password'
    }"
  >
    <div class="app-input__inner">
      <input
        :id="uniqId('input')"
        class="app-input__input"
        ref="element"
        v-model="localValue"
        :type="type"
        :inputType="inputType"
        :disabled="disabled"
        @focus="focusInput"
        @blur="unFocusInput"
        @input="removeError"
        @keydown="isEctionDelete"
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
import { watch, ref, computed, type PropType, type Ref } from 'vue'
import getUniqueId from '@/helpers/getUniqueId'

const emit = defineEmits(['update:modelValue', 'removeError'])

enum InputTypes {
  number = 'number',
  email = 'email',
  password = 'password',
  tel = 'tel',
  text = 'text'
}

const props = defineProps({
  label: { type: String, default: null },
  modelValue: { type: [String, Number], default: undefined },
  required: Boolean,
  inputType: { type: String as PropType<keyof typeof InputTypes>, default: null },
  error: { type: String, default: null },
  disabled: { type: Boolean, default: false }
})

const element = ref<HTMLInputElement | null>(null)
const isInputFocused = ref<boolean>(false)

const showPassword = ref<boolean>(false)

const localValue = ref<string | number | undefined>(props.modelValue || '')

const isDelete = ref<boolean>(false)

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

function getNumericValue(
  localValue: Ref<string | number | undefined>,
  newLocalValue: string | number
): number {
  if (!newLocalValue) {
    localValue.value = ''
    return 0
  }
  const numericValue: string = newLocalValue.toString().replace(/\D/g, '')
  if (numericValue === '0') {
    localValue.value = ''
    return 0
  } else {
    const numberWithSpaces: string = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    localValue.value = numberWithSpaces
    return Number(numericValue)
  }
}

function isEctionDelete(event: KeyboardEvent) {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    isDelete.value = true
  } else isDelete.value = false
}

function getPhone(
  localValue: Ref<string | number | undefined>,
  newLocalValue: string | number
): string {
  newLocalValue = newLocalValue.toString()
  if (newLocalValue.length > 18) {
    newLocalValue = newLocalValue.slice(0, 18)
  }

  let numericArr: string[] = newLocalValue.replace(/\D/g, '').split('')
  let format: string[] = []

  if (!isDelete.value) {
    for (let i = 0; i < numericArr.length; i++) {
      if (numericArr[0] != '7' && numericArr[0] != '8') {
        format[0] = '+'
        format[1] = '7'
        format[2] = ' '
        format[3] = '('
        format[4] = numericArr[0] ? numericArr[0] : ''
      }
      if (numericArr[0] === '7' || numericArr[0] === '8') {
        format[0] = '+'
        format[1] = '7'
        format[2] = ' '
        format[3] = '('
      }
      if (i >= 1 && i <= 3) {
        format[i + 3] = numericArr[i] || ''
      }
      if (i >= 4 && i <= 6) {
        format[7] = ')'
        format[8] = ' '
        format[i + 5] = numericArr[i] || ''
      }
      if (i >= 7 && i <= 8) {
        format[12] = ' '
        format[i + 6] = numericArr[i] || ''
      }
      if (i >= 9 && i <= 10) {
        format[15] = ' '
        format[i + 7] = numericArr[i] || ''
      }
    }
  } else {
    format = newLocalValue.split('')
  }

  localValue.value = format.join('')
  const str = localValue.value

  return str
}

function getTextWithoutSpacesValue(
  localValue: Ref<string | number | undefined>,
  newLocalValue: string | number | undefined
) {
  localValue.value = newLocalValue === undefined ? '' : newLocalValue.toString().replace(/ /g, '')
  return localValue.value
}

function getPasswordValue(newLocalValue: string | number | undefined): string {
  return newLocalValue === undefined ? '' : newLocalValue.toString()
}

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  }
)

watch(
  () => localValue.value,
  (newValue) => {
    let value = null

    if (props.inputType === InputTypes.number && newValue !== undefined) {
      value = getNumericValue(localValue, newValue)
    } else if (props.inputType === InputTypes.email) {
      value = getTextWithoutSpacesValue(localValue, newValue)
    } else if (props.inputType === InputTypes.password) {
      value = getPasswordValue(newValue)
    } else if (props.inputType === InputTypes.tel && newValue !== undefined) {
      value = getPhone(localValue, newValue)
    } else value = newValue

    emit('update:modelValue', value)
  },
  { immediate: true }
)

function focusInput(): void {
  isInputFocused.value = true
}
function unFocusInput(): void {
  isInputFocused.value = false
}

defineExpose({ element })
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

  &--number & {
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

    @media #{$screen-huge} {
      font-size: 20px;
    }
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
