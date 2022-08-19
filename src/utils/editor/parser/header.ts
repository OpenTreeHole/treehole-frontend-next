export function parseHeaderToMarkdown(blocks: any) {
  switch (blocks.level) {
    case 1:
      return `# ${blocks.text}\n`
    case 2:
      return `## ${blocks.text}\n`
    case 3:
      return `### ${blocks.text}\n`
    case 4:
      return `#### ${blocks.text}\n`
    case 5:
      return `##### ${blocks.text}\n`
    case 6:
      return `###### ${blocks.text}\n`
  }
  return `${blocks.text}\n`
}

export function parseHTMLToHeader(element: Element) {
  return {
    data: {
      level: parseInt(element.tagName.substring(1)),
      text: element.innerHTML
    },
    type: 'header'
  }
}
