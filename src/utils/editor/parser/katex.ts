export function parseKatexToMarkdown(blocks: any) {
  const text: string = blocks.text

  return `$$\n${text}\n$$\n`
}

export function parseHTMLToKatex(element: Element) {
  return {
    data: {
      text: element.innerHTML
    },
    type: 'math'
  }
}
