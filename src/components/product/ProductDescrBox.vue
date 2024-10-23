<template>
  <div class="product-descr-box">
    <option-descr
      class="product-descr-box__brand"
      option-name="Брэнд"
      :option-value="formatedBrandName"
    />
    <option-descr
      class="product-descr-box__size"
      option-name="Размер"
      :option-value="formatedSizeName"
    />
    <option-descr class="product-descr-box__color" option-name="Цвет" :option-value="colorName" />
    <div class="product-descr-box__price-box">
      <h2 class="product-descr-box__price-title">Цена:</h2>
      <app-price :price="price" :old-price="oldPrice" />
    </div>
    <app-size-picker
      v-model="updatedSizeId"
      class="product-descr-box__size-picker"
      :sizes="sizes"
    />
    <button-submit
      class="product-descr-box__btn"
      :show-spinner="showBtnSpinner"
      btn-name="В корзину"
      @click="createEvent"
    >
      <svg>
        <use xlink:href="#cart" />
      </svg>
    </button-submit>
  </div>
</template>

<script lang="ts" setup>
import OptionDescr from '@/components/OptionDescr.vue'
import AppPrice from '@/components/AppPrice.vue'
import AppSizePicker from '@/components/UI/AppSizePicker.vue'
import ButtonSubmit from '@/components/UI/ButtonSubmit.vue'

import { computed } from 'vue'
import { type PropType } from 'vue'
import { type Size } from '@/interfaces/CatalogInterfaces'

const props = defineProps({
  formatedBrandName: { type: String, required: true },
  formatedSizeName: { type: String, required: true },
  colorName: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  showBtnSpinner: { type: Boolean, default: false },
  sizes: { type: Array as PropType<Size[]>, required: true },
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue', 'addToCart'])

const updatedSizeId = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})

function createEvent() {
  emit('addToCart')
}
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.product-descr-box {
  display: grid;
  row-gap: 16px;

  &__price-title {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 600;
  }

  &__btn {
    justify-self: flex-start;
    margin-top: 16px;
  }
}

@media #{$screen-medium} {
  .product-descr-box {
    grid-template-columns: auto auto;
    gap: 16px;
    grid-template-areas:
      'price-box brand'
      'price-box size'
      'size-picker color'
      'size-picker color'
      'btn btn';

    &__price-box {
      grid-area: price-box;
    }

    &__brand {
      grid-area: brand;
    }

    &__size {
      grid-area: size;
    }

    &__color {
      grid-area: color;
    }

    &__size-picker {
      grid-area: size-picker;
    }

    &__btn {
      grid-area: btn;
      justify-self: center;
    }
  }
}
</style>
