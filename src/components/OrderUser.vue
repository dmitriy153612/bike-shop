<template>
  <order-fieldset class="order-user" legend="Получатель">
    <app-input
      v-model="updatedUserData.name"
      class="order-user__name"
      label="Имя"
      :required="true"
      :error="updatedUserDataErrors.name"
      @remove-error="updatedUserDataErrors.name = ''"
    />
    <app-input
      v-model="updatedUserData.surname"
      class="order-user__surname"
      label="Фамилия"
      :required="true"
      :error="updatedUserDataErrors.surname"
      @remove-error="updatedUserDataErrors.surname = ''"
    />
    <app-input
      v-model="updatedUserData.phone"
      class="order-user__tel"
      label="Тел."
      input-type="tel"
      :required="true"
      :error="updatedUserDataErrors.phone"
      @remove-error="updatedUserDataErrors.phone = ''"
    />
  </order-fieldset>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import AppInput from '@/components/UI/AppInput.vue'
import OrderFieldset from '@/components/OrderFieldset.vue'
import { type UserContact } from '@/interfaces/OrderInterfaces'

const emit = defineEmits(['update:userData', 'update:userDataErrors'])

const props = defineProps({
  userData: { type: Object as PropType<UserContact>, required: true },
  userDataErrors: { type: Object as PropType<UserContact>, required: true }
})

const updatedUserData = computed({
  get: () => props.userData,
  set: (newValue) => {
    emit('update:userData', newValue)
  }
})
const updatedUserDataErrors = computed({
  get: () => props.userDataErrors,
  set: (newValue) => {
    emit('update:userDataErrors', newValue)
  }
})
</script>
@/interfaces/OrderInterfaces
