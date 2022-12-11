import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DivisionPage from '@/views/DivisionPage.vue'
import HolePage from '@/views/HolePage.vue'
import AdminPage from '@/views/AdminPage.vue'
import SearchPage from '@/views/SearchPage.vue'
import FavoritePage from '@/views/FavoritePage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import LicensePage from '@/views/LicensePage.vue'
import ReportView from '@/views/admin/ReportView.vue'
import DivisionView from '@/views/admin/DivisionView.vue'
import { useDivisionStore } from '@/store'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    isAdmin?: boolean
    requiresAuth: boolean
    hideInNav?: boolean
  }
}

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'report',
    name: 'report',
    meta: {
      title: '举报',
      requiresAuth: true,
      isAdmin: true
    },
    component: ReportView
  },
  {
    path: 'division',
    name: 'division',
    meta: {
      title: '分区',
      requiresAuth: true,
      isAdmin: true
    },
    component: DivisionView
  }
]

export const routes: RouteRecordRaw[] = [
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
    }),
    beforeEnter: (route) => {
      const store = useDivisionStore()
      store.currentDivisionId = parseInt(route.params.id as string)
    }
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
      holeId: parseInt(route.params.id as string),
      floorId: route.query.floor && parseInt(route.query.floor as string)
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
    component: AdminPage,
    children: adminRoutes
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      title: '搜索',
      requiresAuth: true,
      hideInNav: true
    },
    component: SearchPage,
    props: (route) => ({
      searchText: route.query.text
    })
  },
  {
    path: '/favorite',
    name: 'favorite',
    meta: {
      title: '收藏',
      requiresAuth: true
    },
    component: FavoritePage
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
    path: '/license',
    name: 'license',
    meta: {
      title: '协议',
      requiresAuth: false
    },
    component: LicensePage
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
