export const parseInlineTextToMarkdown = (text: string) => {
  // Replace inline code
  text = text.replaceAll(
    /\s*<code class="inline-code">(.*?)<\/code>\s*/g,
    (_, code) => ' ```' + code.trim() + '``` '
  )

  // Replace link
  text = text.replaceAll(
    /\s*<a href="(.*?)">(.*?)<\/a>\s*/g,
    (_, link, str) => ` [${str.trim()}](${link.trim()}). `
  )

  // Replace Emphasis
  text = text.replaceAll(/\s*<b>(.*?)<\/b>\s*/g, (_, str) => ` **${str.trim()}** `)
  text = text.replaceAll(/\s*<b><i>(.*?)<\/b><\/i>\s*/g, (_, str) => ` **${str.trim()}** `)
  text = text.replaceAll(/\s*<i><b>(.*?)<\/i><\/b>\s*/g, (_, str) => ` **${str.trim()}** `)
  text = text.replaceAll(/\s*<i>(.*?)<\/i>\s*/g, (_, str) => ` *${str.trim()}* `)
  return text
}

export const processInnerHTML = (innerHTML: string) => {
  // Replace inline code
  innerHTML = innerHTML.replaceAll(
    /<code\s?.*?>(.*?)<\/code>/g,
    (_, code) => `<code class="inline-code">${code}</code>`
  )

  // Replace Emphasis
  innerHTML = innerHTML.replaceAll(/<strong\s?.*?>(.*?)<\/strong>/g, (_, str) => `<b>${str}</b>`)
  innerHTML = innerHTML.replaceAll(/<em\s?.*?>(.*?)<\/em>/g, (_, str) => `<i>${str}</i>`)

  // Remove images
  innerHTML = innerHTML.replaceAll(/\s*<img\s?.*?>.*?<\/img>\s*/g, (_) => '')
  innerHTML = innerHTML.replaceAll(/\s*<img\s?.*?>\s*/g, (_) => '')

  // Remove inputs
  innerHTML = innerHTML.replaceAll(/\s*<input\s?.*?>.*?<\/input>\s*/g, (_) => '')
  innerHTML = innerHTML.replaceAll(/\s*<input\s?.*?>\s*/g, (_) => '')

  // Remove katex
  innerHTML = innerHTML.replaceAll(/\s*<katex>.*?<\/katex>\s*/g, (_) => '')
  return innerHTML
}
