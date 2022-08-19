export function parseQuoteToMarkdown(blocks: any) {
  return `> ${blocks.text}\n`
}

export function parseHTMLToQuote(element: Element) {
  const quotes: string[] = []
  for (const child of element.children) {
    quotes.push(child.innerHTML)
  }
  return {
    data: {
      alignment: 'left',
      caption: '',
      text: quotes.join(`<br/>`)
    },
    type: 'quote'
  }
}
