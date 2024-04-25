<template>
  <div class="checkbox">
    <input
      :id="uniqId(value.toString())"
      v-model="updatedModelValue"
      type="checkbox"
      class="checkbox__input"
      :value="value"
      @click="handleClick"
    />
    <label class="checkbox__label" :for="uniqId(value.toString())">
      <span class="checkbox__label-checkbox">&#10004;</span>
      <span v-if="name" class="checkbox__label-descr">{{ name }}</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import getUniqueId from '@/helpers/getUniqueId'

const emit = defineEmits(['update:modelValue', 'inputClick'])

const props = defineProps({
  value: { type: [String, Boolean], required: true },
  name: { type: String, default: null },
  modelValue: { type: [Array, String, Boolean], required: true }
})

function handleClick(): void {
  emit('inputClick')
}

const updatedModelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})

const uniqId = getUniqueId()
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.checkbox {
  display: flex;
  flex-wrap: wrap;
  user-select: none;
  transition: color 0.2s ease;

  &__input {
    position: absolute;
    transform: scale(0);
    opacity: 0;
  }

  &__label-descr {
    padding-left: 8px;
    font-size: 16px;
    transition: color 0.2s ease;

    @media #{$screen-huge} {
      font-size: 18px;
    }
  }

  &__input:focus + &__label &__label-descr {
    color: $sunglow;
  }

  &__input:focus + &__label &__label-checkbox {
    border-color: $sunglow;
  }

  &__input:checked + &__label &__label-checkbox {
    color: $sunglow;
  }

  &__label {
    position: relative;
    cursor: pointer;
    white-space: nowrap;
  }

  &__label-checkbox {
    border: 1px solid $boulder;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    width: 24px;
    color: transparent;
    transition-property: color, border-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
    font-size: 20px;

    @media #{$screen-huge} {
      height: 30px;
      width: 30px;
    }
  }
}
</style>
