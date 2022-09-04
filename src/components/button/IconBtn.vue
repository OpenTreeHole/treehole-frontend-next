<template>
  <span :class="small ? 'px-1' : 'px-2'">
    <span
      class="hover:bg-neutral-300 hover:bg-opacity-50 transition cursor-pointer rounded-lg select-none transition"
      :class="small ? '-m-1 p-1' : '-m-1.5 p-1.5'"
      @click="$emit('click')"
    >
      <v-icon
        class="text-left"
        :icon="icon"
      />
      <span
        v-if="text"
        class="pl-1 self-center"
      >
        {{ text }}
      </span>
    </span>
  </span>
</template>

<script
  setup
  lang="ts"
>
import { useSlots } from 'vue'

defineProps<{ small?: boolean; text?: string }>()

defineEmits<{
  (e: 'click'): void
}>()

const slots = useSlots()
const icon = (slots['default']!()[0].children as string).trim()
console.log(icon)
</script>

<style
  lang="scss"
  scoped
></style>
