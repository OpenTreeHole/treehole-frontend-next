<template>
  <div>
    <div
      v-if="loadFail"
      class="py-2 text-2xl text-red-500"
    >
      加载失败
    </div>
    <v-progress-circular
      v-else-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const loadFail = ref(false)

const load = async <T>(promise: Promise<T>): Promise<T> => {
  let res: T
  loading.value = true
  try {
    res = await promise
    loadFail.value = false
  } catch (e) {
    loadFail.value = true
    throw e
  }
  loading.value = false
  return res
}

defineExpose({
  load
})
</script>
