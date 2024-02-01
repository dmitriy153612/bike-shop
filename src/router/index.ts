import { createRouter, createWebHashHistory } from 'vue-router'
import { useLoginStore } from '@/stores/loginStore'
import { useGlobalStore } from '@/stores/globalStore'

const CatalogPage = () => import('@/pages/CatalogPage.vue')
const ProductPage = () => import('@/pages/ProductPage.vue')
const CartPage = () => import('@/pages/CartPage.vue')
const OrderPage = () => import('@/pages/OrderPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/catalog' },
    { path: '/catalog', name: 'catalog', component: CatalogPage },
    { path: '/catalog/product/:id', name: 'product', component: ProductPage },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/order', name: 'order', component: OrderPage },
    { path: '/:pathMatch(.*)', name: 'notFound', component: NotFoundPage }
  ]
})

let isFirstEnter: boolean = true

router.beforeEach(async (to, from, next) => {
  const loginStore = useLoginStore()
  const globalStore = useGlobalStore()
  if (isFirstEnter) {
    isFirstEnter = false
    await loginStore.fetchCheckAuth()
  }
  if (loginStore.token) {
    next()
  } else if ((!loginStore.token && to.name === 'catalog') || to.name === 'product') {
    next()
  } else if (
    !loginStore.token &&
    (from.name === 'catalog' || from.name === 'product') &&
    (to.name === 'order' || to.name === 'cart')
  ) {
    globalStore.openLoginModal(true)
    next(false)
  } else {
    next({ name: 'catalog' })
    globalStore.openLoginModal(true)
  }
})

export default router
