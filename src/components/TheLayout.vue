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
          <v-autocomplete
            v-model:search="searchBar.search"
            class="search-bar max-w-3xl ml-8"
            variant="outlined"
            color="white"
            density="compact"
            full-width
            hide-details
            prepend-inner-icon="mdi-magnify"
            placeholder="使用标签、帖子编号、楼层编号、或文本进行搜索（筛选）"
          >
            <template #no-data>
              <v-list
                v-if="searchBar.search != ''"
                density="compact"
              >
                <v-list-item
                  v-for="(tag, i) in searchBar.tagSuggestion"
                  :key="i"
                  @click="searchByTag(tag.name)"
                >
                  查看标签：[[{{ tag.name }}]]
                </v-list-item>
                <v-list-item
                  v-if="searchBar.isNumber == 1"
                  @click="searchByHoleId"
                  >搜索洞号：#{{ searchBar.search }}</v-list-item
                >
                <v-list-item
                  v-if="searchBar.isNumber == 1"
                  @click="searchByFloorId"
                  >跳转至楼层：##{{ searchBar.search }}</v-list-item
                >
                <v-list-item @click="searchByContent">搜索文本：{{ searchBar.search }}</v-list-item>
              </v-list>
            </template>
          </v-autocomplete>
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
              {{ r.meta.title }}
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
import { ref, watch } from 'vue'
import { useStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'

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
console.log(otherRoutes)

const tagSuggestionList: any = []
const searchBar = ref({ isTag: 0, isNumber: 0, search: '', tagSuggestion: tagSuggestionList })
watch(
  () => searchBar.value.search,
  (value) => {
    if (/^\d*$/.test(value)) {
      searchBar.value.isNumber = 1
    } else {
      searchBar.value.isNumber = 0
    }
    searchBar.value.tagSuggestion = [
      {
        name: value
      },
      {
        name: value + ' test'
      }
    ]
    // searchBar.value.tagSuggestion = /tag?s=value
  },
  { immediate: false }
)
const searchByTag = (tagName: string) => {
  console.log('search tag ' + tagName)
}
const searchByHoleId = () => {
  console.log('search hole ' + searchBar.value.search)
}
const searchByFloorId = () => {
  console.log('search floor ' + searchBar.value.search)
}
const searchByContent = () => {
  console.log('search by content ' + searchBar.value.search)
}
</script>

<style lang="scss">
.search-bar {
  --v-input-padding-top: 6px !important;
}

.search-bar .v-field {
  background: rgb(var(--v-theme-surface));
  border-color: transparent;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.search-bar .v-field__prepend-inner {
  padding-top: 8px;
}
</style>
