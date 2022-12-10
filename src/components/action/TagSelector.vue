<template>
  <div ref="el">
    <v-combobox
      v-model="tags"
      :items="allTags"
      item-title="name"
      variant="outlined"
      hide-details
      density="compact"
      multiple
      hide-selected
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
import { computed, onMounted, ref, watch } from 'vue'
import TagChip from '../tag/TagChip.vue'

const props = defineProps<{
  tags: Tag[]
}>()
const emit = defineEmits<{
  (e: 'update:tags', tags: Tag[]): void
}>()
const tags = computed({
  get: () => props.tags,
  set: (v) => emit('update:tags', v)
})

const el = ref<HTMLElement>()

const tagStore = useTagStore()

const search = ref('')

const allTags = computed(() =>
  tagStore.tags
    .filter((v) => !tags.value.includes(v))
    .filter((v) => v.name.includes(search.value))
    .slice(0, 6)
)

watch(tags, () => {
  if (tags.value.length > 5) tags.value = tags.value.slice(0, 5) // TODO: show error message
  if (tags.value.every((v) => typeof v !== 'string')) return
  tags.value = tags.value
    .filter((v) => typeof v !== 'string' || (v as string).trim() !== '')
    .map((v) => {
      if (typeof v === 'string') {
        if (tagStore.tags.some((t) => t.name === v)) return tagStore.tags.find((t) => t.name === v)!
        else return new Tag((v as string).trim())
      } else return v
    })
})

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
