<template>
  <div
    class="w-full my-2 hover:text-neutral-500 transition cursor-pointer active:text-neutral-400 focus:ring-0 line-clamp-5"
    @click="$router.push(`/hole/${hole.id}`)"
  >
    {{ plainText(hole.firstFloor.content) }}
  </div>
</template>

<script setup lang="ts">
import { Hole } from '@/types'
import { plainText } from '@/utils'

defineProps<{ hole: Hole }>()
</script>
