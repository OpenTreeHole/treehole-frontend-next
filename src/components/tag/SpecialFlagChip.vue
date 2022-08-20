<template>
  <v-chip
    class="select-none"
    label
    :color="color"
  >
    {{ text }}
  </v-chip>
</template>

<script
  setup
  lang="ts"
>
const props = defineProps<{ text: string; color: string }>()
</script>

<style
  lang="scss"
  scoped
></style>
