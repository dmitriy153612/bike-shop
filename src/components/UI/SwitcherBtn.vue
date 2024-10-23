<template>
  <div
    class="switcher-btn"
    :class="{
      'switcher-btn--checked': isChecked,
      'switcher-btn--disabled': disabled
    }"
  >
    <span v-if="disabled" class="switcher-btn__disabled" />
    <input
      :disabled="disabled"
      :id="`switcher-btn${value}`"
      class="switcher-btn__input"
      type="radio"
      :value="value"
      :name="name"
      v-model="updatedId"
    />
    <label :for="`switcher-btn${value}`" class="switcher-btn__label">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: true },
  value: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  name: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])

const updatedId = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})

const isChecked = computed(() => props.value === props.modelValue)
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/style/config/variables.scss' as *;

.switcher-btn {
  position: relative;
  min-height: 56px;

  @media #{$hover-min-width} {
    &:hover {
      background-color: color.adjust($sunglow, $lightness: 38%);
    }
  }

  &--checked & {
    &__label {
      border-color: $sunglow;
      background-color: color.adjust($sunglow, $lightness: 38%);
    }
  }

  &--disabled & {
    &__disabled {
      position: absolute;
      z-index: 1;
      inset: 0;
      border-radius: 6px;
      background-color: $alto;
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__input {
    position: absolute;
    transform: scale(0);
  }

  &__label {
    position: relative;
    display: grid;
    padding: 6px 6px 6px 34px;
    height: 100%;
    cursor: pointer;

    border: 2px solid $alto;
    border-radius: 6px;
    transition-property: border-color, background-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  &__label:checked {
    background-color: color.adjust($sunglow, $lightness: 25%);
    border-color: $sunglow;
  }

  &__label::before {
    position: absolute;
    top: 50%;
    left: 6px;
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid $boulder;
    transform: translateY(-50%);
  }

  &__label::after {
    position: absolute;
    top: 50%;
    left: 11px;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: transparent;
    transform: translateY(-50%);
    transition: background-color 0.2s ease;
  }

  &__input:focus + &__label {
    border-color: $grenadier;
  }

  &__input:checked + label::after {
    background-color: $grenadier;
  }

  &__input:checked + label::before {
    border-color: $grenadier;
  }
}
</style>
