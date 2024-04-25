<template>
  <ul class="filter-checkboxes">
    <li v-for="prop in properties" :key="prop._id" class="filter-checkboxes__item">
      <app-checkbox v-model="updatedModelValue" :value="prop._id" :name="prop.name" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import AppCheckbox from '@/components/AppCheckbox.vue'
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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.filter-checkboxes {
  display: grid;
  gap: 6px;
  position: relative;
  width: max-content;

  @media #{$screen-huge} {
    row-gap: 14px;
  }
}
</style>
