import { parseHeaderToMarkdown, parseHTMLToHeader } from './parser/header'
import { parseHTMLToParagraph, parseParagraphToMarkdown } from './parser/paragraph'
import { parseListToMarkdown, parseHTMLToList } from './parser/list'
import { parseDelimiterToMarkdown, delimiter } from './parser/delimiter'
import { parseImageToMarkdown } from './parser/image'
import { parseCheckboxToMarkdown } from './parser/checkbox'
import { parseHTMLToQuote, parseQuoteToMarkdown } from './parser/quote'
import { parseCodeToMarkdown } from './parser/code'
import { marked } from 'marked'
import { parseHTMLToKatex, parseKatexToMarkdown } from '@/utils/editor/parser/katex'

export const parseEditorJsToMarkdown = (blocks: any[]) => {
  return blocks
    .map((item) => {
      // iterate through editor data and parse the single blocks to markdown syntax
      switch (item.type) {
        case 'header':
          return parseHeaderToMarkdown(item.data)
        case 'paragraph':
          return parseParagraphToMarkdown(item.data)
        case 'list':
          return parseListToMarkdown(item.data).join('\n') + '\n'
        case 'delimiter':
          return parseDelimiterToMarkdown()
        case 'image':
          return parseImageToMarkdown(item.data)
        case 'quote':
          return parseQuoteToMarkdown(item.data)
        case 'checkbox':
          return parseCheckboxToMarkdown(item.data)
        case 'code':
          return parseCodeToMarkdown(item.data)
        case 'checklist':
          return parseCheckboxToMarkdown(item.data)
        case 'math':
          return parseKatexToMarkdown(item.data)
        default:
          return ''
      }
    })
    .join('')
}

export const parseMarkdownToEditorJs = (markdown: string) => {
  markdown = markdown
    .trim()
    .replaceAll(/\$\$([^$]+)\$\$/g, (_, mathExp: string) => `<katex>${mathExp.trim()}</katex>`)
    .replaceAll('\n\n', '\n')
    .replaceAll('\n', '\n\n')
  const html = marked.parse(markdown)
  let editorData: any[] = []

  const element = document.createElement('div')
  element.innerHTML = html
  for (const child of element.children) {
    switch (child.tagName) {
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6':
        editorData.push(parseHTMLToHeader(child))
        break
      case 'P':
        editorData.push(...parseHTMLToParagraph(child))
        break
      case 'UL':
      case 'OL':
        editorData.push(parseHTMLToList(child))
        break
      case 'HR':
        editorData.push(delimiter())
        break
      case 'BLOCKQUOTE':
        editorData.push(parseHTMLToQuote(child))
        break
    }
  }

  editorData = editorData.filter((value) => Object.keys(value).length !== 0)
  return editorData
}
