<template>
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
          v-if="searchBar.isNumber"
          @click="searchByHoleId"
          >搜索洞号：#{{ searchBar.search }}</v-list-item
        >
        <v-list-item
          v-if="searchBar.isNumber"
          @click="searchByFloorId"
          >跳转至楼层：##{{ searchBar.search }}</v-list-item
        >
        <v-list-item @click="searchByContent">搜索文本：{{ searchBar.search }}</v-list-item>
      </v-list>
    </template>
  </v-autocomplete>
</template>

<script
  setup
  lang="ts"
>
import { reactive, watch } from 'vue'

const tagSuggestionList: any = []
const searchBar = reactive({ isNumber: false, search: '', tagSuggestion: tagSuggestionList })
watch(
  () => searchBar.search,
  (value) => {
    searchBar.isNumber = /^\d*$/.test(value) ? true : false
    searchBar.tagSuggestion = [
      {
        name: value
      },
      {
        name: value + ' test'
      }
    ]
    // searchBar.value.tagSuggestion = /tag?s=value
  }
)
const searchByTag = (tagName: string) => {
  console.log('search tag ' + tagName)
}
const searchByHoleId = () => {
  console.log('search hole ' + searchBar.search)
}
const searchByFloorId = () => {
  console.log('search floor ' + searchBar.search)
}
const searchByContent = () => {
  console.log('search by content ' + searchBar.search)
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
