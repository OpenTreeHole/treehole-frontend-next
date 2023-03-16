<template>
  <div class="flex">
    <div class="max-w-full lg:max-w-[65%] 3xl:max-w-[55%] grow">
      <!-- PDF -->
      <template v-if="license.type === 'pdf'">
        <div
          ref="pdfContainer"
          class="lg:my-2 lg:mx-4 h-[85vh]"
        ></div>
      </template>
      <template v-else-if="license.type === 'markdown'">
        <div
          class="lg:my-2 mx-4 lg:mx-8 markdown-viewer"
          v-html="html"
        ></div>
      </template>
    </div>
    <div class="hidden lg:block lg:max-w-[35%] xl:max-w-[30%] 3xl:max-w-[25%] pl-5 grow"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PDFObject from 'pdfobject'
import { parseToTypora } from '@/utils'

const props = defineProps<{ license: { name: string; file: string; type: 'pdf' | 'markdown' } }>()

const pdfContainer = ref<HTMLDivElement | null>(null)

const html = ref<string>('')

onMounted(async () => {
  if (props.license.type === 'pdf') PDFObject.embed(props.license.file, pdfContainer.value)
  else if (props.license.type === 'markdown') {
    const response = await fetch(props.license.file, { cache: 'no-store' })
    const markdown = await response.text()
    html.value = parseToTypora(markdown)
  }
})
</script>
