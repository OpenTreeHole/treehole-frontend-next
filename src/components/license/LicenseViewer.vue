<template>
  <div class="flex">
    <div class="max-w-full lg:max-w-[65%] 3xl:max-w-[55%] grow">
      <!-- PDF -->
      <template v-if="license.type === 'pdf'">
        <div
          ref="pdfContainer"
          class="my-2 lg:mx-4 h-[85vh]"
        ></div>
      </template>
    </div>
    <div class="hidden lg:block lg:max-w-[35%] xl:max-w-[30%] 3xl:max-w-[25%] pl-5 grow"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PDFObject from 'pdfobject'

const props = defineProps<{ license: { name: string; file: string; type: 'pdf' } }>()

const pdfContainer = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (props.license.type === 'pdf') PDFObject.embed(props.license.file, pdfContainer.value)
})
</script>
