import { ref } from 'vue'
import { parseMarkdownToEditorJs } from '@/utils/editor'

export const useEditor = () => {
  const editorData = ref<{ blocks: any[] } | null>(null)

  const initEditor = (markdown: string) => {
    editorData.value = {
      blocks: parseMarkdownToEditorJs(markdown)
    }
  }

  const clearEditor = () => {
    editorData.value = null
  }

  return { editorData, initEditor, clearEditor }
}
