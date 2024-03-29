<template>
  <div>
    <v-app-bar
      color="primary"
      density="compact"
    >
      <v-app-bar-title>
        <div class="max-w-[var(--page-width)] mx-auto flex items-center">
          <v-img
            class="cursor-pointer"
            :src="Logo"
            max-width="199px"
            @click="router.push('/')"
          ></v-img>
          <SearchBar></SearchBar>
          <MessageMenu />
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="showNav"
      :class="{ 'z-20 pt-4 pb-10 w-[calc(50%-var(--page-width)/2+180px)]': !isMobile }"
      width="null"
    >
      <div class="flex justify-end">
        <div class="w-[180px]">
          <v-list>
            <v-list-subheader> 分区 </v-list-subheader>
            <v-list-item
              v-if="divisionStore.divisions.length === 0"
              class="text-left pl-10"
            >
              <span class="text-neutral-400">加载中...</span>
            </v-list-item>
            <v-list-item
              v-for="(division, i) in divisionStore.divisions"
              :key="i"
              class="text-left pl-10 cursor-pointer select-none"
              :class="
                getNavItemClass(
                  (route.name === 'division' || route.name === 'hole') &&
                    divisionStore.currentDivisionId === division.id
                )
              "
              @click="router.push(`/division/${division.id}`)"
            >
              <v-list-item-title>{{ division.name }}</v-list-item-title>
            </v-list-item>
            <v-divider class="border-gray-800" />
            <template v-if="userStore.isAdmin">
              <v-list-item
                class="text-left pl-10 cursor-pointer select-none"
                :class="getNavItemClass(route.path.startsWith('/admin'))"
                @click="router.push('/admin')"
              >
                <v-list-item-title>管理</v-list-item-title>
              </v-list-item>
              <v-divider class="border-gray-800" />
            </template>
            <v-list-item
              v-for="(r, i) in otherRoutes"
              :key="i"
              class="text-left pl-10 cursor-pointer select-none"
              :class="getNavItemClass(route.path === r.path)"
              @click="router.push(r.path)"
            >
              {{ r.meta?.title }}
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main>
      <div class="pl-[calc(50%-var(--page-width)/2+180px)]">
        <slot />
      </div>
    </v-main>

    <NotificationSnackbar />

    <div class="fixed bottom-4 left-4 z-50">
      <v-btn
        v-if="!showNav"
        color="primary"
        fab
        @click="showNav = true"
        @mousedown.prevent
      >
        <v-icon icon="mdi-menu" />
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/img.png'
import SearchBar from '@/components/action/SearchBar.vue'
import { useDivisionStore, useUserStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'
import NotificationSnackbar from './NotificationSnackbar.vue'
import { ref } from 'vue'
import MessageMenu from './MessageMenu.vue'

const router = useRouter()
const route = useRoute()
const divisionStore = useDivisionStore()
const userStore = useUserStore()

const isMobile = window.innerWidth < 1280
const showNav = ref(!isMobile)
const navActiveItemClass = 'text-blue-500 bg-opacity-50 bg-gray-200'
const navInactiveItemClass = 'hover:bg-opacity-30 hover:bg-gray-200'
const getNavItemClass = (active: boolean) => {
  return active ? navActiveItemClass : navInactiveItemClass
}

const otherRoutes = routes.filter(
  (v) =>
    v.name &&
    !v.meta?.hideInNav &&
    ['/division', '/hole', '/admin'].every((u) => !v.path.startsWith(u))
)
</script>

<style lang="scss"></style>
