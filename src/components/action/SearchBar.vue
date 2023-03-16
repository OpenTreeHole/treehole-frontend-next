<template>
  <div
    ref="el"
    class="max-w-3xl ml-8 grow"
  >
    <v-autocomplete
      v-model:search="search"
      v-model="result"
      :items="searchResults"
      item-title="title"
      item-value="value"
      class="search-bar"
      variant="outlined"
      color="white"
      density="compact"
      full-width
      hide-details
      prepend-inner-icon="mdi-magnify"
      placeholder="使用标签、帖子编号、楼层编号、或文本进行搜索（筛选）"
    >
      <template #item="slot">
        <v-list-item
          v-bind="slot.props"
          title=""
        >
          <span v-if="slot.item.value.type === 'holeId'">
            跳转至树洞：#{{ slot.item.value.holeId }}
          </span>
          <span v-else-if="slot.item.value.type === 'floorId'">
            跳转至楼层：##{{ slot.item.value.floorId }}
          </span>
          <span v-else-if="slot.item.value.type === 'tag'">
            查看标签：<span :class="`text-${slot.item.value.tag.color}`">{{
              slot.item.value.tag.name
            }}</span>
          </span>
          <span v-else-if="slot.item.value.type === 'text'">
            搜索文本：{{ slot.item.value.text }}
          </span>
        </v-list-item>
      </template>
      <template #selection="slot">
        <TagChip
          v-if="slot.item.value.type === 'tag'"
          :tag="slot.item.value.tag"
          size="small"
          @click="result = null"
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { useTagStore } from '@/store'
import { Tag } from '@/types'
import { computed, onMounted, ref, watch } from 'vue'
import TagChip from '@/components/tag/TagChip.vue'
import { useRouter } from 'vue-router'
import { getFloor } from '@/apis'
import { useNotification } from '@/composables/notification'

interface HoleIdSearchResult {
  type: 'holeId'
  holeId: number
}

interface FloorIdSearchResult {
  type: 'floorId'
  floorId: number
}

interface TagSearchResult {
  type: 'tag'
  tag: Tag
}

interface TextSearchResult {
  type: 'text'
  text: string
}

type SearchResult = HoleIdSearchResult | FloorIdSearchResult | TagSearchResult | TextSearchResult

const el = ref<HTMLElement>()

const not = useNotification()
const tagStore = useTagStore()
const router = useRouter()

const search = ref('')

const searchResults = computed(() => {
  const results: SearchResult[] = []
  if (/^#?\d+$/.test(search.value)) {
    results.push({ type: 'holeId', holeId: parseInt(search.value.replaceAll('#', '')) })
  }
  if (/^#*\d+$/.test(search.value)) {
    results.push({ type: 'floorId', floorId: parseInt(search.value.replaceAll('#', '')) })
  }
  const tag = tagStore.tags.find((v) => v.name === search.value)
  if (tag) {
    results.push({ type: 'tag', tag })
  }
  if (search.value !== '') {
    results.push({ type: 'text', text: search.value })
  }
  const tagSuggestions = tagStore.tags
    .filter((v) => v.name.includes(search.value))
    .filter((v) => v.name !== search.value)
    .slice(0, 6)
  return results.concat(tagSuggestions.map((v) => ({ type: 'tag', tag: v }))).map((v) => ({
    title: JSON.stringify(v), // v-autocomplete requires a title to real-time update the search results. This title is not shown to the user.
    value: v
  }))
})

const result = ref<SearchResult | null>(null)
const filterTag = computed(() => tagStore.filterTag)

watch(filterTag, (tag) => {
  if (tag) result.value = { type: 'tag', tag }
})

watch(result, (result) => {
  console.log(result)
  tagStore.filterTag = null
  search.value = ''
  if (!result) return
  if (result.type === 'holeId') searchByHoleId(result.holeId)
  else if (result.type === 'floorId') searchByFloorId(result.floorId)
  else if (result.type === 'tag') searchByTag(result.tag)
  else if (result.type === 'text') searchByText(result.text)
  ;(document.activeElement as HTMLElement | null)?.blur() // Seems not working for text search
})

const searchByTag = (tag: Tag | null) => {
  tagStore.filterTag = tag
  if (router.currentRoute.value.name !== 'division') router.push('/division/1')
}
const searchByHoleId = (holeId: number) => {
  router.push('/hole/' + holeId)
}
const searchByFloorId = async (floorId: number) => {
  const floor = await getFloor(floorId)
  if (floor) {
    router.push('/hole/' + floor.holeId + '?floor=' + floorId)
  }
}
const searchByText = (text: string) => {
  router.push('/search?text=' + text)
}

onMounted(() => {
  el.value?.querySelector('input')?.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      if (search.value.trim() !== '') {
        result.value = searchResults.value[0]?.value
      } else {
        not.warning('搜索内容不能为空！')
      }
      search.value = ''
    } else if (e.key === 'Escape') {
      search.value = ''
    }
  })
})
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
