<template>
  <button ref="element" class="btn-reset">
    {{ btnName }}
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps({
  btnName: { type: String, required: true }
})

const element = ref<HTMLButtonElement | null>(null)

defineExpose({ element })
</script>
