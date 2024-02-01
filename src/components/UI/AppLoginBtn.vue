<template>
  <button ref="element" class="login-btn">
    <svg v-if="svgId" class="login-btn__svg">
      <use xlink:href="#user" />
    </svg>
    <span v-if="btnText">{{ btnText }}</span>
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps({
  svgId: { type: String, default: null },
  btnText: { type: String, default: null }
})

const element = ref<HTMLButtonElement | null>(null)

defineExpose({ element })
</script>
