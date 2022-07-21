import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DivisionPage from '@/views/DivisionPage.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    isAdmin?: boolean
    requiresAuth: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/division/:id',
    name: 'division',
    meta: {
      title: '树洞',
      requiresAuth: true
    },
    component: DivisionPage,
    props: (route) => ({
      divisionId: parseInt(route.params.id as string)
    })
  },
  {
    path: '/',
    redirect: '/division/1'
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
