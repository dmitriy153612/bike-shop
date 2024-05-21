<template>
  <ul class="pickup-addresses" :options="scrollbarOptions">
    <li v-for="(item, index) in pickupList" :key="index" class="pickup-addresses__item">
      <switcher-btn :value="item._id" v-model="updatedModelValue">
        <div class="pickup-addresses__inner">
          <span class="pickup-addresses__metro-box">
            <svg class="pickup-addresses__svg" :fill="item.lineColor">
              <use xlink:href="#metro" />
            </svg>
            <span class="pickup-addresses__metro">{{ item.metro }}</span>
          </span>
          <span class="pickup-addresses__address">{{ item.address }}</span>
          <span class="pickup-addresses__date-box">
            <span v-for="(date, i) in item.workTime" :key="i" class="pickup-addresses__date-item">
              <span class="pickup-addresses__day">{{ date.day }}:</span>
              <span class="pickup-addresses__time">{{ date.time }}</span>
            </span>
          </span>
        </div>
      </switcher-btn>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import SwitcherBtn from '@/components/UI/SwitcherBtn.vue'
import { useOrderStore } from '@/stores/orderStore'
import { type PropType, computed } from 'vue'
import { type Pickpoint } from '@/interfaces/OrderInterfaces'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  pickupList: { type: Array as PropType<Pickpoint[]>, required: true },
  modelValue: { type: String, required: true }
})

const orderStore = useOrderStore()

const scrollbarOptions = {
  wheelPropagation: false
}

const updatedModelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  }
})

orderStore.fetchGetPickupPoints()
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.pickup-addresses {
  display: grid;
  row-gap: 18px;
  padding: 10px 4px 0 0;
  max-height: 285px;

  overflow-y: scroll;
  scroll-behavior: smooth;

  @media #{$screen-huge} {
    max-height: 340px;
  }

  &__inner {
    display: grid;
    grid-template-areas:
      'metro-box date-box'
      'address date-box';
    gap: 6px;

    @media #{$screen-small} {
      grid-template-areas:
        'metro-box'
        'date-box'
        'address';
    }
  }

  &__metro-box {
    grid-area: metro-box;
    display: flex;
    gap: 4px;
    align-items: flex-end;
  }

  &__svg {
    height: 24px;
    width: 24px;
  }

  &__metro {
    line-height: 1;
    font-weight: 600;
  }

  &__address {
    grid-area: address;

    padding-left: 28px;
    line-height: 1.15;

    @media #{$screen-small} {
      padding-left: 10px;
    }
  }

  &__date-box {
    grid-area: date-box;
    display: grid;
    justify-self: flex-end;
    align-self: flex-start;

    font-size: 12px;

    @media #{$screen-small} {
      justify-self: flex-start;
    }
  }

  &__date-item {
    display: flex;
    gap: 4px;
    justify-content: space-between;

    @media #{$screen-small} {
      justify-content: flex-start;
      padding-left: 10px;
    }
  }

  &__day {
    white-space: nowrap;
    font-weight: 600;
  }

  &__time {
    white-space: nowrap;
  }

  &__date-item {
    flex-wrap: nowrap;
  }
}
</style>
