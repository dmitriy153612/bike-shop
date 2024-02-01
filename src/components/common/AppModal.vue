<template>
  <transition name="appear">
    <div v-if="showModal" class="overlay" @mousedown="closeModal" @keydown="handleEsc">
      <div
        ref="modalEl"
        class="overlay__modal modal"
        role="dialog"
        aria-modal="true"
        @mousedown.stop
      >
        <app-button-cross
          ref="btnEl"
          aria-label="закрыть"
          class="modal__btn-close"
          @click="closeModal"
        />
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import AppButtonCross from '@/components/UI/AppButtonCross.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { ref, onMounted, computed, watch, type PropType } from 'vue'

const emit = defineEmits(['closeModal'])

const props = defineProps({
  btnOpenModal: { type: Object as PropType<HTMLButtonElement | null>, default: null },
  showModal: { type: Boolean, default: false }
})

const globalStore = useGlobalStore()

const modalEl = ref<HTMLDivElement | null>(null)
const btnEl = ref<{ element: HTMLButtonElement | null } | null>(null)

const isLoginModalOpen = computed<boolean>(() => globalStore.isLoginModalOpen)

onMounted(() => {
  document.addEventListener('focusin', handleFocusIn)
})

function handleFocusIn(event: FocusEvent): void {
  if (modalEl.value && !modalEl.value.contains(event.target as HTMLElement)) {
    event.preventDefault()
    btnEl.value?.element?.focus()
  }
}

function closeModal(): void {
  emit('closeModal')
  document.removeEventListener('focusin', handleFocusIn)
}

function handleEsc(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closeModal()
  }
}

watch(
  () => isLoginModalOpen.value,
  (newValue) => {
    if (!newValue && props.btnOpenModal) {
      props.btnOpenModal['focus']()
    }
  }
)
</script>
