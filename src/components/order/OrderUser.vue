<template>
  <ul class="order-user">
    <li class="order-user__item">
      <app-input
        v-model="updatedUserData.name"
        class="order-user__name"
        label="Имя"
        :required="true"
        :error="updatedUserDataErrors.name"
        @remove-error="updatedUserDataErrors.name = ''"
      />
    </li>
    <li class="order-user__item">
      <app-input
        v-model="updatedUserData.surname"
        class="order-user__surname"
        label="Фамилия"
        :required="true"
        :error="updatedUserDataErrors.surname"
        @remove-error="updatedUserDataErrors.surname = ''"
      />
    </li>
    <li class="order-user__item">
      <app-input
        v-model="updatedUserData.phone"
        class="order-user__tel"
        label="Тел."
        input-type="tel"
        :required="true"
        :error="updatedUserDataErrors.phone"
        @remove-error="updatedUserDataErrors.phone = ''"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import AppInput from '@/components/UI/AppInput.vue'
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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.order-user {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
</style>
