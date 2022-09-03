<template>
  <v-chip
    v-ripple
    :color="tag.color"
    variant="outlined"
    :size="size"
    class="select-none"
  >
    {{ tag.name }}
  </v-chip>
</template>

<script
  setup
  lang="ts"
>
import { Tag } from '@/types'

const { size = 'default' } = defineProps<{ tag: Tag; size?: string | number }>()
</script>
