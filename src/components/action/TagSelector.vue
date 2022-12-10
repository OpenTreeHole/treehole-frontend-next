<template>
  <div ref="el">
    <v-combobox
      :model-value="tags"
      :items="allTags"
      item-title="name"
      variant="outlined"
      hide-details
      density="compact"
      multiple
      hide-selected
      @update:model-value="onTagsChange"
    >
      <template #selection="{ item, index }">
        <TagChip
          class="mr-1"
          :tag="item.raw"
          size="small"
          @click="tags.splice(index, 1)"
        />
      </template>
    </v-combobox>
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

const onTagsChange = (newTags: any) => {
  let t = newTags as (Tag | string)[]
  if (t.length > 5) t = t.slice(0, 5) // TODO: show error message
  tags.value = t
    .filter((v) => typeof v !== 'string' || (v as string).trim() !== '')
    .map((v) => {
      if (typeof v === 'string') {
        if (tagStore.tags.some((t) => t.name === v)) return tagStore.tags.find((t) => t.name === v)!
        else return new Tag((v as string).trim())
      } else return v
    })
}

onMounted(() => {
  tagStore.fetchTags()

  // Some black magic to deal with the shitty v-combobox
  el.value?.querySelector('input')?.addEventListener('input', () => {
    search.value = el.value?.querySelector('input')?.value || ''
  })
  el.value?.querySelector('input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      search.value = el.value?.querySelector('input')?.value || ''
    }
  })
})
</script>
