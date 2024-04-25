<template>
  <transition name="appear">
    <div v-if="showModal" class="modal-overlay" @mousedown="closeModal" @keydown="handleEsc">
      <div
        ref="modalEl"
        class="modal-overlay__modal"
        role="dialog"
        aria-modal="true"
        @mousedown.stop
      >
        <button-cross
          ref="btnEl"
          aria-label="закрыть"
          class="modal-overlay__btn-close"
          @click="closeModal"
        />
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import ButtonCross from '@/components/ButtonCross.vue'
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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.modal-overlay {
  position: fixed;
  z-index: 20;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $layoutBackground;
  padding: 5px;

  &__modal {
    position: relative;
    width: 100%;
    max-width: 350px;
    padding: 30px 15px 5px;
    background-color: $black;

    @media #{$screen-huge} {
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__btn-close {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>
