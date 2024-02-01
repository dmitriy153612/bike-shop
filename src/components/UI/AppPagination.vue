<template>
  <div class="pagination">
    <div class="pagination__inner">
      <button
        class="pagination__btn pagination__btn-control pagination__btn--left"
        @click="goToPage(currentPage - 1)"
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
