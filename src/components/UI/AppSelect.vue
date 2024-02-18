<template>
  <div ref="selectEl" class="select" :class="{ open: isSelectOpen }">
    <div
      ref="placeholderEl"
      class="select-placeholder select__placeholder"
      tabindex="0"
      @click="toggleSelect"
      @keypress.enter="toggleSelect"
    >
      {{ selectedItemLabel || placeholder }}
      <span class="select-placeholder__triangle" />
    </div>
    <div ref="listWrapperEl" class="select__list-wrapper">
      <ul ref="listEl" class="select__list">
        <li
          v-for="(prop, index) in properties"
          :key="index"
          class="select__item"
          :class="{ selected: selectedId === prop.id }"
          @click="selectItem(prop)"
          @keypress.enter="selectItem(prop)"
        >
          {{ prop.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, type PropType } from 'vue'

interface SelectProperty {
  id: string
  label: string
}

const emit = defineEmits(['select'])

const props = defineProps({
  properties: { type: Array as PropType<SelectProperty[]>, required: true },
  selectedId: { type: String, required: true },
  placeholder: { type: String, default: 'Выберите опцию' }
})

const selectEl = ref<HTMLDivElement | null>(null)
const placeholderEl = ref<HTMLDivElement | null>(null)
const listWrapperEl = ref<HTMLDivElement | null>(null)
const listEl = ref<HTMLUListElement | null>(null)

const selectedItemLabel = ref<string>('')
const isSelectOpen = ref<boolean>(false)

function selectItem(prop: SelectProperty): void {
  selectedItemLabel.value = prop.label
  emit('select', prop.id)
  closeSelect()
}

function setSizeToSelect(): void {
  if (placeholderEl.value && listWrapperEl.value) {
    placeholderEl.value.style.minWidth = `${listWrapperEl.value.offsetWidth}px`
  }
  if (listWrapperEl.value && placeholderEl.value) {
    listWrapperEl.value.style.top = `${placeholderEl.value.offsetHeight}px`
  }
  if (listWrapperEl.value && placeholderEl.value) {
    listWrapperEl.value.style.minWidth = placeholderEl.value.style.minWidth
  }
}

function closeSelect(): void {
  if (listWrapperEl.value) {
    listWrapperEl.value.style.height = '0'
  }
  isSelectOpen.value = false
  if (listEl.value) {
    listEl.value.querySelectorAll('li').forEach((li) => {
      li.removeAttribute('tabindex')
    })
  }
}

function openSelect(): void {
  if (listWrapperEl.value && listEl.value) {
    listWrapperEl.value.style.height = `${listEl.value.offsetHeight}px`
  }
  isSelectOpen.value = true
  if (listEl.value) {
    listEl.value.querySelectorAll('li').forEach((li) => {
      li.setAttribute('tabindex', '0')
    })
  }
  if (listEl.value) {
    const firstItemEl: HTMLLIElement | null = listEl.value.querySelector('li')
    if (firstItemEl) {
      firstItemEl.focus()
    }
  }
  setSizeToSelect()
}

function toggleSelect(): void {
  if (!isSelectOpen.value) {
    openSelect()
  } else {
    closeSelect()
  }
}

function closeSelectByClick(event: MouseEvent): void {
  if (selectEl.value && !selectEl.value.contains(event.target as HTMLElement)) {
    closeSelect()
  }
}

function closeSelectByEsc(event: KeyboardEvent): void {
  if (event.code === 'Escape') {
    closeSelect()
  }
}

function setInitialLabel() {
  if (props.selectedId) {
    const selectedProperty: SelectProperty | undefined = props.properties.find(
      (prop) => prop.id === props.selectedId
    )
    if (selectedProperty) {
      selectedItemLabel.value = selectedProperty.label
    }
  }
}

onMounted(() => {
  setSizeToSelect()
  setInitialLabel()
  window.addEventListener('click', closeSelectByClick)
  window.addEventListener('keydown', closeSelectByEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeSelectByClick)
  window.removeEventListener('keydown', closeSelectByEsc)
})
</script>
