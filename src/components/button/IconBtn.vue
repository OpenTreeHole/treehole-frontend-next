<template>
  <span :class="small ? 'px-1' : 'px-2'">
    <div
      :class="className"
      @click="$emit('click')"
    >
      <v-icon
        class="text-center"
        :class="iconClass"
        :icon="icon"
      />
      <span
        v-if="text !== undefined"
        class="pl-1 self-center text-sm"
      >
        {{ text }}
      </span>
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps<{
  small?: boolean
  text?: any
  noAction?: boolean
  iconClass?: string | string[] | Record<string, boolean>
}>()

defineEmits<{
  (e: 'click'): void
}>()

const slots = useSlots()
const icon = computed(() => (slots['default']!()[0].children as string).trim())

const className = computed(() => ({
  'select-none flex': true,
  'hover:bg-neutral-300 hover:bg-opacity-50 transition cursor-pointer rounded-lg': !props.noAction,
  '-m-1 p-1': props.small,
  '-m-1.5 p-1.5': !props.small
}))
</script>

<style lang="scss" scoped></style>
