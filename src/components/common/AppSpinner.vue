<template>
  <div :class="typeClass" class="spinner-overlay">
    <div class="spinner-overlay__spinner-wrapper">
      <div class="spinner-overlay__spinner" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'screen' }
})

enum SpinnerTypes {
  button = 'button',
  card = 'card'
}

const typeClass = computed(() => {
  if (props.type === SpinnerTypes.button) {
    return 'button-spinner'
  } else if (props.type === SpinnerTypes.card) {
    return 'card-spinner'
  } else {
    return 'screen-spinner'
  }
})
</script>
