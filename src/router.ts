import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DivisionPage from '@/views/DivisionPage.vue'
import HolePage from '@/views/HolePage.vue'
import AdminPage from '@/views/AdminPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'

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
    path: '/hole/:id',
    name: 'hole',
    meta: {
      title: '树洞',
      requiresAuth: true
    },
    component: HolePage,
    props: (route) => ({
      holeId: parseInt(route.params.id as string)
    })
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      title: '管理',
      requiresAuth: true,
      isAdmin: true
    },
    component: AdminPage
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      title: '设置',
      requiresAuth: true
    },
    component: SettingsPage
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
