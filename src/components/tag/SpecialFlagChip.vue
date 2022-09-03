<template>
  <v-chip
    class="select-none"
    label
    :color="color"
    :size="size"
  >
    {{ text }}
  </v-chip>
</template>

<script
  setup
  lang="ts"
>
const { size = 'default' } = defineProps<{ text: string; color: string; size?: string | number }>()
</script>

<style
  lang="scss"
  scoped
></style>
