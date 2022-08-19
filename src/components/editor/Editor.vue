<template>
  <div class="my-2">
    <div
      ref="editorDiv"
      class="text-left min-h-[300px]"
    ></div>
    <div class="flex my-2 mx-10 justify-end">
      <v-btn
        class="mr-3"
        @click="$emit('close')"
      >
        取消
      </v-btn>
      <v-btn class="text-white bg-blue-500">发送</v-btn>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { onMounted, ref } from 'vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import SimpleImage from '@editorjs/simple-image'
import List from '@editorjs/list'
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote'
import Code from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import MathTex from 'editorjs-math'
import { parseEditorJsToMarkdown } from '@/utils/editor'

const props = defineProps<{ data: { blocks: any[] } }>()

defineEmits<{
  (e: 'close'): void
}>()

const editorDiv = ref()

onMounted(() => {
  const editor = new EditorJS({
    /**
     * Enable/Disable the read only mode
     */
    readOnly: false,

    /**
     * Wrapper of Editor
     */
    holder: editorDiv.value,

    minHeight: 0,

    placeholder: '说些什么...',

    /**
     * Common Inline Toolbar settings
     * - if true (or not specified), the order from 'tool' property will be used
     * - if an array of tool names, this order will be used
     */
    // inlineToolbar: ['link', 'marker', 'bold', 'italic'],
    // inlineToolbar: true,

    /**
     * Tools list
     */
    tools: {
      /**
       * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
       */
      header: {
        class: Header,
        inlineToolbar: ['link'],
        config: {
          placeholder: 'Header'
        },
        shortcut: 'CMD+SHIFT+H'
      },

      /**
       * Or pass class directly without any configuration
       */
      image: SimpleImage,

      list: {
        class: List,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+L'
      },

      checklist: {
        class: Checklist,
        inlineToolbar: true
      },

      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: "Quote's author"
        },
        shortcut: 'CMD+SHIFT+O'
      },

      code: {
        class: Code,
        shortcut: 'CMD+SHIFT+C'
      },

      delimiter: Delimiter,

      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C'
      },

      linkTool: LinkTool,

      embed: Embed,

      table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+ALT+T'
      },

      math: {
        class: MathTex
      }
    },

    /**
     * This Tool will be used as default
     */
    // defaultBlock: 'paragraph',

    /**
     * Initial Editor data
     */
    data: props.data,
    onChange: async (api, event) => {
      console.log('something changed', event)
      const data = await api.saver.save()

      const content = data.blocks
      const parsedData = parseEditorJsToMarkdown(content)
    }
  })
})
</script>

<style
  lang="scss"
  scoped
></style>