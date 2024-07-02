import { createRouter, createWebHashHistory } from 'vue-router'
import { useLoginStore } from '@/stores/loginStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useFilterStore } from '@/stores/filterSore'

const CatalogPage = () => import('@/pages/CatalogPage.vue')
const ProductPage = () => import('@/pages/ProductPage.vue')
const CartPage = () => import('@/pages/CartPage.vue')
const OrderPage = () => import('@/pages/OrderPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/catalog' },
    {
      path: '/catalog',
      name: 'catalog',
      component: CatalogPage,
      meta: { requiresAuth: false },
      beforeEnter: async (to) => {
        const filterSore = useFilterStore()
        Promise.allSettled([
          filterSore.fetchColors(),
          filterSore.fetchSizes(),
          filterSore.fetchBrands()
        ])
        if (!to.query.page && to.name) {
          return {
            query: { ...to.query, page: 1 },
            name: to.name
          }
        }
      }
    },
    {
      path: '/catalog/product/:id',
      name: 'product',
      component: ProductPage,
      meta: { requiresAuth: false }
    },
    { path: '/cart', name: 'cart', component: CartPage, meta: { requiresAuth: true } },
    { path: '/order', name: 'order', component: OrderPage, meta: { requiresAuth: true } },
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: NotFoundPage,
      meta: { requiresAuth: false }
    }
  ]
})

let isFirstEnter: boolean = true

router.beforeEach(async (to) => {
  const loginStore = useLoginStore()
  const globalStore = useGlobalStore()
  if (isFirstEnter) {
    isFirstEnter = false
    await loginStore.fetchCheckAuth()
  }

  if (to.meta.requiresAuth && !loginStore.token) {
    globalStore.openLoginModal(true)
    return {
      name: 'catalog',
      query: { page: 1 }
    }
  }
})

export default router
