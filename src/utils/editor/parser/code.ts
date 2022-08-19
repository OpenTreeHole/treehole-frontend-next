export function parseCodeToMarkdown(blocks: any) {
  return `\`\`\`\n${blocks.code}\n\`\`\`\n`
}

export function parseMarkdownToCode(blocks: any) {
  return {
    data: {
      code: blocks.value
    },
    type: 'code'
  }
}
