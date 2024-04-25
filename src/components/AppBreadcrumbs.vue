<template>
  <nav class="breadcrumbs">
    <ul class="breadcrumbs__list">
      <li class="breadcrumbs__item" v-for="(item, index) in breadcrumbs" :key="index">
        <router-link
          :to="{ name: item.pageName, params: item.params, query: item.query }"
          :class="{ 'breadcrumbs__link--last': index + 1 === breadcrumbs.length }"
          class="breadcrumbs__link"
          :tabindex="index + 1 === breadcrumbs.length ? -1 : 0"
        >
          <span class="breadcrumbs__link-text">{{ item.linkName }}</span>
          <svg class="breadcrumbs__svg">
            <use xlink:href="#breadcrumbs"></use>
          </svg>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import { type Breadcrumbs } from '@/interfaces/BreadcrumbsInterface'

defineProps({
  breadcrumbs: { type: Array as PropType<Breadcrumbs[]>, required: true }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.breadcrumbs {
  &__list {
    display: flex;
    column-gap: 4px;
    flex-wrap: wrap;
  }

  &__link {
    display: flex;
    align-items: center;
    column-gap: 2px;
    flex-wrap: nowrap;

    &:focus-visible {
      outline: 1px solid $sunglow;
    }

    &--last {
      pointer-events: none;
    }
  }

  @media #{$hover-min-width} {
    &__link:hover {
      outline: none;
    }
    &__link:hover &__link-text::before {
      transform: translateY(0);
      border-color: $sunglow;
    }
  }

  &__link--last &__svg {
    display: none;
  }
  &__link--last &__link {
    display: none;
  }

  &__link-text {
    position: relative;

    &::before {
      position: absolute;
      content: '';
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 1px solid transparent;
      transform: translateY(2px);
      transition-property: border-color, transform;
      transition-duration: 0.2s;
      transition-timing-function: ease;
    }
  }

  &__svg {
    height: 14px;
    width: 14px;
  }
}
</style>
