import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBtnByClick } from '@/helpers/getBtnByClick'

export const useGlobalStore = defineStore('globalStore', () => {
  const isLoginModalOpen = ref<boolean>(false)
  const isMainSpinnerShown = ref<boolean>(false)
  const isSelectedCartItemAmountChanging = ref<number>(0)
  const isfilterOpen = ref<boolean>(false)
  const screenWidth = ref(window.innerWidth)
  const btnOpenModal = ref<HTMLButtonElement | HTMLAnchorElement | null>(null)

  function openLoginModal(isOpen: boolean, event: Event | null = null): void {
    isLoginModalOpen.value = isOpen
    setBtnOpenModal(event)
  }

  function showSpinner(show: boolean): void {
    isMainSpinnerShown.value = show
  }

  function updateIsSelectedCartItemAmountChanging(value: number): void {
    isSelectedCartItemAmountChanging.value += value
  }

  function toggleFilter(event: Event | null = null) {
    isfilterOpen.value = !isfilterOpen.value
    if (isfilterOpen.value) {
      setBtnOpenModal(event)
    }
  }

  function setBtnOpenModal(e: Event | null = null) {
    if (e) {
      btnOpenModal.value = getBtnByClick(e)
    }
  }

  function clearBtnOpen() {
    btnOpenModal.value = null
  }

  window.addEventListener('resize', () => {
    screenWidth.value = window.innerWidth
  })

  return {
    isLoginModalOpen,
    openLoginModal,

    isMainSpinnerShown,
    showSpinner,

    isSelectedCartItemAmountChanging,
    updateIsSelectedCartItemAmountChanging,

    isfilterOpen,
    toggleFilter,

    screenWidth,

    setBtnOpenModal,
    clearBtnOpen,
    btnOpenModal
  }
})
