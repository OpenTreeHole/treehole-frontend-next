<template>
  <div
    ref="el"
    class="max-w-3xl ml-8 grow"
  >
    <v-autocomplete
      v-model:search="search"
      v-model="result"
      class="search-bar"
      variant="outlined"
      color="white"
      density="compact"
      full-width
      hide-details
      prepend-inner-icon="mdi-magnify"
      placeholder="使用标签、帖子编号、楼层编号、或文本进行搜索（筛选）"
      multiple
    >
      <template #no-data>
        <v-list density="compact">
          <v-list-item
            v-if="isHoleId"
            @click="searchByHoleId"
          >
            跳转至树洞：#{{ holeId }}
          </v-list-item>
          <v-list-item
            v-if="isFloorId"
            @click="searchByFloorId"
          >
            跳转至楼层：##{{ floorId }}
          </v-list-item>
          <v-list-item
            v-for="(tag, i) in tagSuggestions"
            :key="i"
            @click="searchByTag(tag)"
          >
            查看标签：
            <span :class="`text-${tag.color}`">{{ tag.name }}</span>
          </v-list-item>

          <v-list-item
            v-if="search !== ''"
            @click="searchByContent"
          >
            搜索文本：{{ search }}
          </v-list-item>
        </v-list>
      </template>
      <template #selection="{ item }">
        <TagChip
          v-if="item.raw.tag"
          :tag="item.raw.tag"
          size="small"
          @click="searchByTag(null)"
        />
        <span v-else-if="item.raw.text">{{ item.raw.text }}</span>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { useTagStore } from '@/store'
import { Tag } from '@/types'
import { computed, onMounted, ref } from 'vue'
import TagChip from '@/components/tag/TagChip.vue'
import { useRouter } from 'vue-router'
import { getFloor } from '@/apis'

const el = ref<HTMLElement>()

const tagStore = useTagStore()
const router = useRouter()

const search = ref('')
const tagSuggestions = computed(() =>
  tagStore.tags.filter((v) => v.name.includes(search.value)).slice(0, 6)
)

const result = computed(() => {
  if (tagStore.filterTag) {
    return { tag: tagStore.filterTag }
  }
  return {}
})

const isHoleId = computed(() => /^#?\d+$/.test(search.value))
const holeId = computed(() => {
  return parseInt(search.value.replaceAll('#', ''))
})

const isFloorId = computed(() => /^#*\d+$/.test(search.value))
const floorId = computed(() => {
  return parseInt(search.value.replaceAll('#', ''))
})

const searchByTag = (tag: Tag | null) => {
  tagStore.filterTag = tag
  if (router.currentRoute.value.name !== 'division') router.push('/division/1')
  search.value = ''
  ;(document.activeElement as HTMLElement | null)?.blur()
}
const searchByHoleId = () => {
  router.push('/hole/' + holeId.value)

  tagStore.filterTag = null
  search.value = ''
  ;(document.activeElement as HTMLElement | null)?.blur()
}
const searchByFloorId = async () => {
  const floor = await getFloor(floorId.value)
  if (floor) {
    router.push('/hole/' + floor.holeId + '?floor=' + floorId.value)
    tagStore.filterTag = null
    search.value = ''
    ;(document.activeElement as HTMLElement | null)?.blur()
  }
}
const searchByContent = () => {
  router.push('/search?text=' + search.value)
  tagStore.filterTag = null
  search.value = ''
  ;(document.activeElement as HTMLElement | null)?.blur()
}

onMounted(() => {
  tagStore.fetchTags()

  el.value?.querySelector('input')?.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      if (search.value === '') {
        return
      }
      if (isHoleId.value) {
        searchByHoleId()
      } else if (isFloorId.value) {
        searchByFloorId()
      } else if (tagSuggestions.value.length > 0) {
        searchByTag(tagSuggestions.value[0])
      } else {
        searchByContent()
      }
    } else if (e.key === 'Escape') {
      search.value = ''
    } else if (e.key === 'Backspace') {
      if (search.value === '') {
        tagStore.filterTag = null
      }
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
