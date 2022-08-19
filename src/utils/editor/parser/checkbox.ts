import { parseInlineTextToMarkdown } from '@/utils/editor/parser/inline'

export function parseCheckboxToMarkdown(blocks: any) {
  let items: any = {}

  items = blocks.items.map((item: any) => {
    if (item.checked === true) {
      return `- [x] ${parseInlineTextToMarkdown(item.text)}`
    }
    return `- [ ] ${parseInlineTextToMarkdown(item.text)}`
  })

  return items.join('\n') + '\n'
}
