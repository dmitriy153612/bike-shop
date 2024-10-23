<template>
  <div :class="{ overlay: !disabled }">
    <focus-trap :disabled="disabled">
      <div :class="{ overlay__inner: !disabled }" @mousedown.self="emit('close')">
        <slot />
      </div>
    </focus-trap>
  </div>
</template>

<script setup lang="ts">
import FocusTrap from 'vue-focus-lock'
import { computed, onMounted, onUnmounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'

const props = defineProps({
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const globalStore = useGlobalStore()

const btnOpenModal = computed<HTMLButtonElement | HTMLAnchorElement | null>(
  () => globalStore.btnOpenModal
)
function closeByEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

function lockScroll(isLock: boolean) {
  const body: HTMLElement = document.body
  const app: HTMLElement | null = document.getElementById('app')

  if (isLock) {
    body.style.overflowY = 'hidden'
    if (app) {
      app.style.overflowY = 'hidden'
    }
  } else {
    body.style.overflowY = ''
    if (app) {
      app.style.overflowY = ''
    }
  }
}

onMounted(() => {
  if (!props.disabled) {
    lockScroll(true)
    window.addEventListener('keydown', closeByEsc)
  }
})

onUnmounted(() => {
  lockScroll(false)
  window.removeEventListener('keydown', closeByEsc)
  if (btnOpenModal.value) {
    btnOpenModal.value.focus()
    globalStore.clearBtnOpen()
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.overlay {
  position: fixed;
  z-index: 30;
  inset: 0;
  background-color: $layoutBackground;

  &__inner {
    position: absolute;
    inset: 0;
    padding: 20px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 350px;
    justify-content: center;
    align-items: center;
    overflow: auto;
    max-height: 100%;
    width: 100%;
  }
}
</style>
