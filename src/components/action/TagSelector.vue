<template>
  <div ref="el">
    <v-autocomplete
      v-model:search="search"
      :model-value="tags"
      item-title="name"
      variant="outlined"
      hide-details
      density="compact"
      multiple
      :menu="true"
      hide-selected
    >
      <template #no-data>
        <v-list density="compact">
          <v-list-item
            v-for="(tag, i) in allTags"
            :key="i"
            class="my-1"
            :class="`text-${tag.color}`"
            @click="onClickSuggestions(tag)"
          >
            <v-list-item-title>{{ tag.name }}</v-list-item-title>
            <v-list-item-subtitle class="flex">
              <v-icon icon="mdi-fire"></v-icon>
              <span class="self-center">{{ tag.temperature }}</span>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </template>
      <template #selection="{ item, index }">
        <TagChip
          class="mr-1"
          :tag="item.raw"
          size="small"
          @click="tags.splice(index, 1)"
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { useTagStore } from '@/store'
import { Tag } from '@/types'
import { computed, onMounted, ref } from 'vue'
import TagChip from '../tag/TagChip.vue'

const props = defineProps<{
  modelValue: Tag[]
  filter?: (tag: Tag) => boolean
  filterTags?: Tag[]
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', tags: Tag[]): void
}>()
const tags = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const el = ref<HTMLElement>()

const tagStore = useTagStore()

const search = ref('')

const allTags = computed(() =>
  tagStore.tags
    .filter((v) => !tags.value.includes(v))
    .filter((v) => v.name.includes(search.value))
    .filter((v) => !props.filterTags?.some((t) => t.name === v.name))
    .filter((v) => !props.filter || props.filter(v))
    .slice(0, 6)
)

const addTag = (tag: Tag) => {
  if (tags.value.length >= 5) return
  tags.value.push(tag)
}

const onClickSuggestions = (tag: Tag) => {
  addTag(tag)
  search.value = ''
}

onMounted(() => {
  tagStore.fetchTags()

  // Some black magic to deal with the shitty v-combobox
  el.value?.querySelector('input')?.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      if (search.value.trim() !== '') {
        if (allTags.value.length > 0) {
          addTag(allTags.value[0])
        } else {
          const tag = new Tag(search.value.trim())
          addTag(tag)
        }
      }
      search.value = ''
    } else if (e.key === 'Escape') {
      search.value = ''
    } else if (e.key === 'Backspace') {
      tags.value.pop()
    }
  })
})
</script>
