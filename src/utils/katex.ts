import { RenderContext } from 'typora-parser/build/src/parser'
import { Block } from 'typora-parser/build/src/blocks/block'
import katex from 'katex'

const macros: any = []
export const convertKatex = (str: string) => {
  return str
    .replaceAll(/\$\$([^$]+)\$\$/g, (ignore, k) => {
      return katex.renderToString(k, {
        displayMode: true,
        macros
      })
    })
    .replaceAll(/\$([^$]+)\$/g, (ignore, k) => {
      return katex.renderToString(k, {
        displayMode: false,
        macros
      })
    })
}

export class KatexRenderer {
  render(str: string, context: RenderContext) {
    if (context.parent instanceof Block)
      return katex.renderToString(str, {
        displayMode: true,
        macros
      })
    else
      return katex.renderToString(str, {
        displayMode: false,
        macros
      })
  }
}
