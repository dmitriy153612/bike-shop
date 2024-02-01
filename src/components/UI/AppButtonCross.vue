<template>
  <button ref="element" class="btn-cross">
    <span class="btn-cross__cross">
      <span class="btn-cross__line btn-cross__line--left" />
      <span class="btn-cross__line btn-cross__line--right" />
    </span>
    <span v-if="name" class="btn-cross__name">
      {{ name }}
    </span>
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps({
  name: { type: String, default: null }
})
const element = ref<HTMLButtonElement | null>(null)
defineExpose({ element })
</script>
