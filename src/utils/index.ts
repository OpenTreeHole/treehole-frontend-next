import { assign, camelCase, keys, pick, snakeCase } from 'lodash'
import katex from 'katex'
import { marked } from 'marked'

const macros: any = []

const colorList = [
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'blue-grey',
  'grey'
]

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const max = (...nums: number[]) => {
  if (nums.length === 0) return 0
  let maxNum = nums[0]
  for (const num of nums) {
    maxNum = num > maxNum ? num : maxNum
  }
  return maxNum
}

export const convertDate = (v: any): string => {
  const date = new Date(v)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

export const timeDifference = (date: Date): string => {
  const now = new Date()

  let seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 0) {
    seconds = 0
  }
  if (seconds < 60) {
    return seconds + '秒前'
  } else if (seconds < 3600) {
    return Math.floor(seconds / 60) + '分钟前'
  } else if (seconds < 86400) {
    return Math.floor(seconds / 3600) + '小时前'
  } else if (seconds < 604800) {
    return Math.floor(seconds / 86400) + '天前'
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
}

export const camelizeKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v))
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key])
      }),
      {}
    )
  }
  return obj
}

export const snakifyKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakifyKeys(v))
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [snakeCase(key)]: snakifyKeys(obj[key])
      }),
      {}
    )
  }
  return obj
}

export const mark = (str: string) => {
  return marked(convertKatex(str))
}

export const reduceKeys = (reduced: any, before: any): any => {
  assign(reduced, pick(before, keys(reduced)))
  return reduced
}

export const convertKatex = (str: string) => {
  return str
    .replace(/\$\$([^$]+)\$\$/g, (ignore, k) => {
      return katex.renderToString(k, {
        displayMode: true,
        macros
      })
    })
    .replace(/\$([^$]+)\$/g, (ignore, k) => {
      return katex.renderToString(k, {
        displayMode: false
      })
    })
}

/**
 * Randomly generate a specific color for a certain tag name.
 * @param tagName - the name of the tag.
 * @return - the generated color.
 */
export const parseTagColor = (tagName: string): string => {
  if (tagName === null) return ''
  if (tagName[0] === '*') return 'red'
  let num = 0
  for (let i = 0; i < tagName.length; i++) {
    num += tagName.charCodeAt(i)
  }
  num %= colorList.length
  return colorList[num]
}

export const delay = async (ms: number) => {
  // return await for better async stack trace support in case of errors.
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export const checkType = (object: any, keysOfType: string[]): boolean => {
  for (const key of keysOfType) {
    if (!(key in object)) return false
  }
  return true
}
