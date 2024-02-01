<template>
  <order-fieldset class="order-pickup" legend="Пункт выдачи">
    <ul ref="scrollContainerEl" class="pickup-addresses">
      <li
        v-for="(item, index) in pickupList"
        :key="index"
        :class="{ selected: modelValue === item._id }"
        class="pickup-addresses__item order-radio"
      >
        <input
          :id="`pickup-address-${index}`"
          v-model="updatedModelValue"
          class="order-radio__input"
          type="radio"
          name="pickup-address"
          :value="item._id"
          @focus="focusedElId = `pickup-address-${index}`"
        />
        <label class="order-radio__label" :for="`pickup-address-${index}`">
          <span class="order-radio__metro-box">
            <svg class="order-radio__svg" :fill="item.lineColor">
              <use xlink:href="#metro" />
            </svg>
            <span class="order-radio__metro">{{ item.metro }}</span>
          </span>
          <span class="order-radio__address">{{ item.address }}</span>
          <span class="order-radio__date-box">
            <span v-for="(date, i) in item.workTime" :key="i" class="order-radio__date-item">
              <span class="order-radio__day">{{ date.day }}:</span>
              <span class="order-radio__time">{{ date.time }}</span>
            </span>
          </span>
        </label>
      </li>
    </ul>
  </order-fieldset>
</template>

<script lang="ts" setup>
import { type PropType, computed, ref, watch } from 'vue'
import OrderFieldset from '@/components/OrderFieldset.vue'
import { useOrderStore } from '@/stores/orderStore'
import { type Pickpoint } from '@/interfaces/OrderInterfaces'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  pickupList: { type: Array as PropType<Pickpoint[]>, required: true },
  modelValue: { type: String, required: true }
})

const orderStore = useOrderStore()

const focusedElId = ref<string>('')
const scrollContainerEl = ref<HTMLElement | null>(null)

const updatedModelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  }
})

orderStore.fetchGetPickupPoints()

function scrollToFocusedElem(focusedElId: string) {
  const focusedRadioBtn = document.getElementById(focusedElId)
  if (focusedRadioBtn && scrollContainerEl.value) {
    scrollContainerEl.value.scrollTop =
      focusedRadioBtn.offsetTop - scrollContainerEl.value.offsetTop
  }
}

watch(
  () => focusedElId.value,
  (newValue) => {
    scrollToFocusedElem(newValue)
  }
)
</script>
@/interfaces/OrderInterfaces
