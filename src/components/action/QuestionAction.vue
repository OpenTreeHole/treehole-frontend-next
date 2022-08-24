<template>
  <div class="flex">
    <span
      class="self-center font-semibold"
      :class="textClass"
    >
      {{ text }}
    </span>
    <slot />
    <span
      v-if="!$slots['default']"
      class="grow"
    />
    <IconBtn
      class="self-center text-green"
      small
      @click="$emit('done')"
    >
      md:done
    </IconBtn>
    <IconBtn
      class="self-center text-red"
      small
      @click="$emit('cancel')"
    >
      md:close
    </IconBtn>
  </div>
</template>

<script
  setup
  lang="ts"
>
import IconBtn from '@/components/button/IconBtn.vue'
import { useSlots } from 'vue'

defineEmits<{
  (e: 'done'): void
  (e: 'cancel'): void
}>()

defineProps<{
  text: string
  textClass?: string
}>()
</script>

<style
  lang="scss"
  scoped
></style>
