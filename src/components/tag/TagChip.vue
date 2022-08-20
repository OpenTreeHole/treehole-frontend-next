<template>
  <v-chip
    v-ripple
    :color="tag.color"
    variant="outlined"
    class="select-none"
    small
  >
    {{ tag.name }}
  </v-chip>
</template>

<script
  setup
  lang="ts"
>
import { Tag } from '@/types'

defineProps<{ tag: Tag }>()
</script>
