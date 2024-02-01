<template>
  <fieldset class="size-picker">
    <legend class="size-picker__legend">Доступные размеры:</legend>
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
  </fieldset>
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
@/interfaces/CatalogInterfaces
