import { parseInlineTextToMarkdown, processInnerHTML } from '@/utils/editor/parser/inline'

export function parseListToMarkdown(blocks: any): string[] {
  switch (blocks.style) {
    case 'unordered':
      return blocks.items.map((item: any) => `- ${parseInlineTextToMarkdown(item)}`)
    case 'ordered':
      return blocks.items.map(
        (item: any, index: number) => `${index + 1}. ${parseInlineTextToMarkdown(item)}`
      )
  }
  return []
}

export function parseHTMLToList(element: Element) {
  const itemData: any[] = []

  if (/^<input.*?>.*?/g.test(element.children[0].innerHTML)) {
    for (const child of element.children) {
      itemData.push({
        text: processInnerHTML(child.innerHTML),
        checked: child.children[0].hasAttribute('checked')
      })
    }
    return {
      data: {
        items: itemData
      },
      type: 'checklist'
    }
  }

  for (const child of element.children) {
    itemData.push(processInnerHTML(child.innerHTML))
  }

  return {
    data: {
      items: itemData,
      style: element.tagName === 'OL' ? 'ordered' : 'unordered'
    },
    type: 'list'
  }
}
