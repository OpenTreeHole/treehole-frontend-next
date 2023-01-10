import { parseInlineTextToMarkdown, processInnerHTML } from '@/utils/editor/parser/inline'
import { parseHTMLToKatex } from '@/utils/editor/parser/katex'

export function parseParagraphToMarkdown(blocks: any) {
  const text: string = blocks.text

  return `${parseInlineTextToMarkdown(text)}\n`
}

export function parseHTMLToParagraph(element: Element) {
  const paragraphs: any[] = []
  const text = processInnerHTML(element.innerHTML)
  if (text) {
    paragraphs.push({
      data: {
        text: text
      },
      type: 'paragraph'
    })
  }
  for (const child of element.children) {
    if (child.tagName === 'IMG') {
      paragraphs.push({
        data: {
          caption: child.getAttribute('alt'),
          stretched: false,
          url: child.getAttribute('src'),
          withBackground: false,
          withBorder: true
        },
        type: 'image'
      })
    } else if (child.tagName === 'KATEX') {
      paragraphs.push(parseHTMLToKatex(child))
    }
  }
  return paragraphs
}
