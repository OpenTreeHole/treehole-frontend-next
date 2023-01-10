export function parseDelimiterToMarkdown() {
  const delimiter = '---'

  return delimiter.concat('\n')
}

export function delimiter() {
  return {
    data: {
      items: []
    },
    type: 'delimiter'
  }
}
