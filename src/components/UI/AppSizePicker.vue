<template>
  <div class="size-picker">
    <title class="size-picker__title">Доступные размеры:</title>
    <ul class="size-picker__list">
      <li v-for="(size, index) in sizes" :key="index" class="size-picker__item">
        <input
          :id="uniqId('size', index.toString())"
          v-model="updatedModelValue"
          type="radio"
          class="size-picker__input"
          :value="size._id"
        />
        <label class="size-picker__label" :for="uniqId('size', index.toString())">
          <span class="size-picker__descr">{{ size.name }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import getUniqueId from '@/helpers/getUniqueId'
import { type Size } from '@/interfaces/CatalogInterfaces'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  sizes: { type: Array as PropType<Size[]>, required: true },
  modelValue: { type: String, required: true }
})

const updatedModelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})
const uniqId = getUniqueId()
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.size-picker {
  margin: 0;
  padding: 0;
  border: none;

  &__title {
    display: flex;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  &__list {
    display: flex;
    gap: 10px;
    margin: 0;
    padding: 0 0 0 4px;
  }

  &__item {
    position: relative;
    display: flex;
  }

  &__input {
    position: absolute;
    transform: scale(0);
    opacity: 0;
    cursor: pointer;
  }

  &__label {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid $boulder;
    border-radius: 5px;
    padding: 1px;
    font-size: 18px;
    min-width: 1.5em;
    color: $boulder;
    cursor: pointer;
    transition: all 0.3s ease;
    transition-property: border-color, color, transform, background-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  &__input + &__label {
    user-select: none;
  }

  &__descr {
    text-transform: uppercase;
  }

  &__input:checked + &__label {
    color: $white;
    border-color: $black;
    background-color: $black;
    transform: scale(1.3);
  }

  &__input:focus + &__label {
    color: $sunglow;
  }
}
</style>
