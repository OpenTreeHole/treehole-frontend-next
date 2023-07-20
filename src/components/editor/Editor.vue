<template>
  <div class="my-2">
    <div class="text-left lg:ml-5 flex justify-center">
      <div class="lg:max-w-[calc(var(--editor-max-width))] max-w-full grow pr-2">
        <textarea ref="editorDiv"></textarea>
      </div>
    </div>
    <div
      v-if="editor"
      class="flex my-2 lg:ml-5 justify-center"
    >
      <div class="max-w-[var(--editor-max-width)] grow flex justify-end">
        <IconBtn @click="$emit('close')"> mdi-close </IconBtn>
        <IconBtn @click="togglePreview">
          {{ isPreview ? 'mdi-language-markdown' : 'mdi-eye' }}
        </IconBtn>
        <IconBtn
          class="text-blue-500"
          @click="$emit('send', editor.value())"
        >
          mdi-send
        </IconBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EasyMDE from 'easymde'
import IconBtn from '../button/IconBtn.vue'

const props = defineProps<{ data: string }>()

defineEmits<{
  (e: 'close'): void
  (e: 'send', markdown: string): void
}>()

const editorDiv = ref()
const editor = ref<EasyMDE>()
const isPreview = ref(false)

onMounted(() => {
  editor.value = new EasyMDE({
    element: editorDiv.value,
    initialValue: props.data,
    toolbar: false,
    scrollbarStyle: 'null',
    renderingConfig: {
      codeSyntaxHighlighting: true
    },
    spellChecker: false,
    status: false,
    placeholder: '请输入发帖内容...\n树洞支持使用 Markdown 格式发帖！'
  })
})

const togglePreview = () => {
  EasyMDE.togglePreview(editor.value!)
  isPreview.value = !isPreview.value
}
</script>
