<template>
  <div>
    <v-app-bar
      color="primary"
      density="compact"
    >
      <v-app-bar-title>
        <div class="max-w-[var(--page-width)] mx-auto flex">
          <v-img
            :src="Logo"
            max-width="199px"
          ></v-img>
          <search-bar></search-bar>
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
      class="z-20 pt-4 pb-10 w-[calc(50%-var(--page-width)/2+180px)]"
      width="null"
    >
      <div class="flex justify-end">
        <div class="w-[180px]">
          <v-list>
            <v-list-subheader> 分区 </v-list-subheader>
            <v-list-item
              v-if="store.divisions.length === 0"
              class="text-left pl-10"
            >
              <span class="text-neutral-400">加载中...</span>
            </v-list-item>
            <v-list-item
              v-for="(division, i) in store.divisions"
              :key="i"
              class="text-left pl-10 cursor-pointer select-none"
              :class="
                getNavItemClass(
                  (route.name === 'division' || route.name === 'hole') &&
                    store.currentDivisionId === division.id
                )
              "
              @click="router.push(`/division/${division.id}`)"
            >
              <v-list-item-title>{{ division.name }}</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item
              class="text-left pl-10 cursor-pointer select-none"
              :class="getNavItemClass(route.path.startsWith('/admin'))"
              @click="router.push('/admin')"
            >
              <v-list-item-title>管理</v-list-item-title>
            </v-list-item>
            <v-divider />
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
  </div>
</template>

<script
  setup
  lang="ts"
>
import Logo from '@/assets/img.png'
import SearchBar from '@/components/action/SearchBar.vue'
import { useStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const store = useStore()
const navActiveItemClass = 'text-blue-500 bg-opacity-50 bg-gray-200'
const navInactiveItemClass = 'hover:bg-opacity-30 hover:bg-gray-200'
const getNavItemClass = (active: boolean) => {
  return active ? navActiveItemClass : navInactiveItemClass
}

const otherRoutes = routes.filter(
  (v) => v.name && ['/division', '/hole', '/admin'].every((u) => !v.path.startsWith(u))
)

const items = [
  { title: '搜索标签：[[tag]]', value: '1' },
  { title: '搜索洞号：#hole', value: '2' },
  { title: '搜索楼层：##floorid', value: '3' },
  { title: '搜索文本：text', value: '4' }
]
const searchBar = ref({ input: '', search: '', tips: items })
const onClickSearchTip = (value: any) => {
  console.log('clicked')
  if (value.value) {
    switch (value.id) {
      case '1':
        searchBar.value.input = '[[' + searchBar.value.search.replace(/[#']+/g, '') + ']]'
        break
      case '2':
        searchBar.value.input = '#' + searchBar.value.search.replace(/[[\]#']+/g, '')
        break
      case '3':
        searchBar.value.input = '##' + searchBar.value.search.replace(/[[\]#']+/g, '')
        break
      default:
        searchBar.value.input = searchBar.value.search.replace(/[[\]#']+/g, '')
    }
  } else {
    switch (value.id) {
      case '1':
        searchBar.value.input = searchBar.value.search.replace(/[[\]']+/g, '')
        break
      case '2':
      case '3':
        searchBar.value.input = searchBar.value.search.replace(/[#']+/g, '')
        break
      default:
    }
  }
  searchBar.value.search = searchBar.value.input
}
const submitSearch = () => {
  if (searchBar.value.search != '') {
    // todo: reg for checking whether search is valid
    searchBar.value.input = searchBar.value.search
    console.log('search ' + searchBar.value.search)
    // todo
  }
}
</script>

<style lang="scss"></style>
