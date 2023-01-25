<template>
  <div ref="el">
    <v-autocomplete
      v-model:search="search"
      :model-value="tagsForAutoComplete"
      chips
      :items="allTags"
      item-title="title"
      item-value="value"
      variant="outlined"
      hide-details
      density="compact"
      multiple
      hide-selected
      @update:model-value="updateTags"
    >
      <template #no-data>
        <v-list density="compact">
          <v-list-item class="my-1">
            <v-list-item-title>没有找到标签</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>

      <template #item="slot">
        <v-list-item
          v-bind="slot.props"
          class="my-1"
          :class="`text-${slot.item.value.color}`"
        >
          <v-list-item-subtitle class="flex">
            <v-icon icon="mdi-fire"></v-icon>
            <span class="self-center">{{ slot.item.value.temperature }}</span>
          </v-list-item-subtitle>
        </v-list-item>
      </template>
      <template #chip="slot">
        <TagChip
          v-bind="slot.props"
          class="mr-1"
          :tag="slot.item.value"
          size="small"
          @click="updateTags(modelValue.filter((v, i) => i != slot.index))"
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/notification'
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

const tagsForAutoComplete = computed(() =>
  props.modelValue.map((v) => ({ title: v.name, value: v }))
)

const updateTags = (tags: Tag[]) => {
  if (tags.length > 5) {
    not.error('最多只能添加 5 个标签！')
    return
  }
  // Reject if there are duplicate tags (if two tags have the same name)
  if (tags.some((v, i) => tags.findIndex((t) => t.name === v.name) !== i)) {
    not.error('标签不能重复！')
    return
  }
  emit('update:modelValue', tags)
}

const el = ref<HTMLElement>()

const not = useNotification()
const tagStore = useTagStore()

const search = ref('')

const allTags = computed(() => {
  const trimSearch = search.value.trim()

  let tags = tagStore.tags
    .filter((v) => !props.modelValue.includes(v))
    .filter((v) => v.name.includes(trimSearch))
    .filter((v) => !props.filterTags?.some((t) => t.name === v.name))
    .filter((v) => !props.filter || props.filter(v))
    .slice(0, 6)

  if (trimSearch !== '') {
    if (tags.some((v) => v.name === trimSearch)) {
      // Put the tag that matches the search at the top
      tags = tags
        .filter((v) => v.name === trimSearch)
        .concat(tags.filter((v) => v.name !== trimSearch))
    } else tags = [new Tag(search.value.trim()), ...tags]
  }
  return tags.map((v) => ({ title: v.name, value: v }))
})

onMounted(() => {
  tagStore.fetchTags()

  // Some black magic to deal with the shitty v-autocomplete
  el.value?.querySelector('input')?.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      if (search.value.trim() !== '') {
        updateTags([...props.modelValue, new Tag(search.value)])
      } else {
        not.warning('标签不能为空！')
      }
      search.value = ''
    } else if (e.key === 'Escape') {
      search.value = ''
    }
  })
})
</script>
