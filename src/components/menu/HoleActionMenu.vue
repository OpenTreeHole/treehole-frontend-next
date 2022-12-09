<template>
  <div class="self-center">
    <v-menu
      bottom
      offset-y
    >
      <template #activator="{ props }">
        <v-icon
          :icon="icon"
          :size="size"
          v-bind="props"
        ></v-icon>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
const items = [{ title: '举报' }, { title: '转发' }]

const { size = 20 } = defineProps<{ size?: number; icon: string }>()
</script>
