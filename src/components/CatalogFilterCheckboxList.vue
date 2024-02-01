<template>
  <ul class="filter-checkboxes">
    <li v-for="prop in properties" :key="prop._id" class="filter-checkboxes__item">
      <app-checkbox v-model="updatedModelValue" :value="prop._id" :name="prop.name" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import { type Size } from '@/interfaces/CatalogInterfaces'
import { type PropType, computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  properties: { type: Array as PropType<Size[]>, required: true },
  modelValue: { type: Array as PropType<string | string[]>, required: true }
})

const updatedModelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})
</script>
