<template>
  <div ref="selectEl" class="select" :class="{ 'select--open': isSelectOpen }">
    <div
      ref="placeholderEl"
      class="select__placeholder"
      tabindex="0"
      @click="toggleSelect"
      @keypress.enter="toggleSelect"
    >
      {{ selectedItemLabel || placeholder }}
      <span class="select__triangle" />
    </div>
    <div ref="listWrapperEl" class="select__list-wrapper">
      <ul ref="listEl" class="select__list">
        <li
          v-for="(prop, index) in properties"
          :key="index"
          class="select__item"
          :class="{ 'select__item--selected': selectedId === prop.id }"
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
import { ref, onMounted, onBeforeUnmount, type PropType, watch } from 'vue'

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

function selectLabel(selectedId: string) {
  const selectedProperty: SelectProperty | undefined = props.properties.find(
    (item) => item.id === selectedId
  )
  if (!selectedProperty) return
  selectedItemLabel.value = selectedProperty.label
}

watch(
  () => props.selectedId,
  (newValue) => {
    selectLabel(newValue)
  }
)

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
    } else {
      selectedItemLabel.value = props.placeholder
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

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.select {
  position: relative;
  font-size: 16px;
  cursor: pointer;
  background-color: $black;
  color: $white;

  &--open & {
    &__triangle {
      transform: translateY(-50%) rotate3d(1, 0, 0, 180deg);
    }
  }

  &__placeholder,
  &__item {
    min-width: max-content;
    transition-property: background-color, color, box-shadow, border-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  &__placeholder {
    position: relative;
    border: 1px solid $boulder;
    padding: 8px 32px 8px 12px;
    color: $sunglow;
  }

  &__placeholder:focus {
    border-color: $sunglow;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 1);
    outline: none;
  }

  &__placeholder:hover &__triangle {
    @media #{$hover-min-width} {
      color: $sunglow;
      border-top-color: $sunglow;
    }
  }

  &__triangle {
    position: absolute;
    top: 50%;
    right: 8px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 9px 8px 0 8px;
    border-color: $boulder transparent transparent transparent;
    transform: translateY(-50%);
    transition-property: transform border-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  &__list-wrapper {
    position: absolute;
    z-index: 5;
    overflow-y: hidden;
    transition: height 0.2s ease;
    height: 0;
    background-color: $black;
  }

  &__list {
    border: 1px solid $boulder;
    border-top: none;
    width: 100%;
  }

  &__item {
    padding: 16px 32px 16px 12px;

    @media #{$hover-min-width} {
      &:hover {
        box-shadow: inset 0px 0px 6px 3px rgba(0, 0, 0, 0.5);
        background-color: $boulder;
      }
    }

    &--selected {
      display: none;
    }
  }

  &__item:focus {
    background-color: $boulder;
    outline: none;
  }
}
</style>
