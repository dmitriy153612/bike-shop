import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
  const isLoginModalOpen = ref<boolean>(false)
  const isMainSpinnerShown = ref<boolean>(false)
  const isSelectedCartItemAmountChanging = ref<number>(0)
  const isFilterOpen = ref<boolean>(false)

  function openLoginModal(isOpen: boolean): void {
    isLoginModalOpen.value = isOpen
  }

  function showSpinner(show: boolean): void {
    isMainSpinnerShown.value = show
  }

  function updateIsSelectedCartItemAmountChanging(value: number): void {
    isSelectedCartItemAmountChanging.value += value
  }

  function toggleFilter(value: boolean | undefined = undefined) {
    if (value === false || value === true) {
      isFilterOpen.value = value
    } else {
      if (window.innerWidth > 1024) {
        return
      }
      isFilterOpen.value = !isFilterOpen.value
    }
    if (isFilterOpen.value && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  return {
    isLoginModalOpen,
    openLoginModal,

    isMainSpinnerShown,
    showSpinner,

    isSelectedCartItemAmountChanging,
    updateIsSelectedCartItemAmountChanging,

    isFilterOpen,
    toggleFilter
  }
})
