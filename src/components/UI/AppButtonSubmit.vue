<template>
  <component
    :is="elementType"
    class="btn-submit"
    :class="{ spinner: showSpinner }"
    :type="elementType === 'button' ? 'submit' : null"
  >
    <slot />
    {{ btnName }}
    <transition name="appear">
      <app-spinner v-if="showSpinner" type="button" />
    </transition>
  </component>
</template>

<script lang="ts" setup>
import AppSpinner from '@/components/common/AppSpinner.vue'
import { type PropType } from 'vue'

defineProps({
  btnName: { type: String, required: true },
  elementType: { type: String as PropType<'button' | 'router-link'>, default: 'button' },
  showSpinner: { type: Boolean, default: false }
})
</script>
