export function parseImageToMarkdown(blocks: any) {
  return `![${blocks.caption}](${blocks.url})`.concat('\n')
}
