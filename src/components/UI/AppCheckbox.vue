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
