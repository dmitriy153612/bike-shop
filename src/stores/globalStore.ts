import { defineStore } from 'pinia'
import { ref } from 'vue'
import { lockScroll } from '@/helpers/lockScroll'

export const useGlobalStore = defineStore('globalStore', () => {
  const isLoginModalOpen = ref<boolean>(false)
  const isMainSpinnerShown = ref<boolean>(false)
  const isSelectedCartItemAmountChanging = ref<number>(0)
  const isfilterOpen = ref<boolean>(false)

  function openLoginModal(isOpen: boolean): void {
    lockScroll(isOpen)
    isLoginModalOpen.value = isOpen
  }

  function showSpinner(show: boolean): void {
    isMainSpinnerShown.value = show
  }

  function updateIsSelectedCartItemAmountChanging(value: number): void {
    isSelectedCartItemAmountChanging.value += value
  }

  function toggleFilter() {
    isfilterOpen.value = !isfilterOpen.value
  }

  return {
    isLoginModalOpen,
    openLoginModal,

    isMainSpinnerShown,
    showSpinner,

    isSelectedCartItemAmountChanging,
    updateIsSelectedCartItemAmountChanging,

    isfilterOpen,
    toggleFilter
  }
})
