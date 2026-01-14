import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '../stores/users.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    // {
    //   path: '/heroes',
    //   name: 'Heroes',
    //   component: () => import('../views/HeroesView.vue'),
    // },
    {
      path: '/books',
      name: 'Books',
      component: () => import('../views/BooksView.vue'),
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  // get user store instance
  const userStore = useUserStore()

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  // check if component requires authentication and if valid token exists otherwise redirect to login component
  if (authRequired) {
    if (userStore.tokenExp() == true) {
      return next('/login')
    }
  }
  next()
})
