<template>
  <div class="pagination">
    <div class="pagination__inner">
      <button
        class="pagination__btn pagination__btn-control pagination__btn--left"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        &#9668;
      </button>

      <ul class="pagination__list-btn">
        <li v-for="page in totalPages" :key="page" class="pagination__item">
          <button
            class="pagination__btn pagination__btn-page"
            :class="{ checked: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </li>
      </ul>
      <button
        class="pagination__btn pagination__btn-control pagination__btn--right"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        &#9658;
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  totalPages: { type: Number, required: true }
})

const route = useRoute()
const router = useRouter()

const currentPage = ref<number>(1)

function goToPage(page: number): void {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page
    setPageToRoute(page)
  }
}

function setPageToRoute(page: number): void {
  router.push({ query: { ...route.query, page } })
}

watch(
  () => route.query['page'],
  (newPage) => {
    const numericNewPage: number = Number(newPage)
    if (!Number.isNaN(numericNewPage)) {
      if (numericNewPage <= 0) {
        currentPage.value = 1
      } else if (numericNewPage > props.totalPages) {
        currentPage.value = props.totalPages
      } else {
        currentPage.value = numericNewPage
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.pagination {
  display: flex;
  justify-content: center;
  padding: 10px 10px;
  width: 100%;
  background-color: $black;

  &__inner {
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 10px;
  }

  &__list-btn {
    display: flex;
    gap: 2px;
  }

  &__btn {
    cursor: pointer;
    border: 1px solid $black;
    border: 1px solid transparent;
    font-size: 20px;
    color: $sunglow;
    background-color: transparent;
    transition: border-color 0.2s ease;
    transition-property: border-color, color, transform;
    transition-duration: 0.2s;
    transition-timing-function: ease;
    outline: none;

    &:disabled {
      pointer-events: none;
    }
  }

  &__btn:focus {
    border-color: $sunglow;
  }

  &__btn-control {
    padding: 0 5px;
    font-size: 22px;
    background-color: transparent;
    line-height: 100%;
  }

  @media #{$hover-min-width} {
    &__btn--left:hover {
      transform: translateX(-7%);
    }

    &__btn--right:hover {
      transform: translateX(7%);
    }
  }

  &__btn-page.checked {
    color: $grenadier;
    transform: scale(1.4);
  }
}
</style>
