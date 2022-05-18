import { DigitsArr } from '../Calculator/model'
import { btnsArray } from '../Calculator/model'

type numType = number | string

const opConverion = {
  [btnsArray[3].key]: '/',
  [btnsArray[7].key]: '*',
  [btnsArray[11].key]: '-',
  [btnsArray[15].key]: '+',
}

const opPriority: { [key: string]: number } = {
  // divide and mul are 1
  // plus and minus are 2
  '/': 1,
  '*': 1,
  '-': 2,
  '+': 2,
}

/**
 * transform number to accurated 15 digits precision
 * @param num
 * @param precision
 * @returns
 */
function strip(num: numType, precision = 15): number {
  return +parseFloat(Number(num).toPrecision(precision))
}
/**
 * get digits length of a number (exponent supported)
 * @param num
 * @returns
 */
function digitLength(num: numType): number {
  // Get digit length of e
  const eSplit = num.toString().split(/[eE]/)
  const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0)
  return len > 0 ? len : 0
}
/**
 * transform float to Interger(eponent supported)
 * @param num
 * @returns
 */
function float2Int(num: numType): number {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''))
  }
  const dLen = digitLength(num)
  return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num)
}

function doArithmetic(
  s1: number,
  s2: number,
  op: '/' | '*' | '-' | '+'
): number {
  switch (op) {
    case '*': {
      const intS1 = float2Int(s1)
      const intS2 = float2Int(s2)
      const tenslength = digitLength(s1) + digitLength(s2)
      return (intS1 * intS2) / Math.pow(10, tenslength)
    }
    case '/': {
      const intS1 = float2Int(s1)
      const intS2 = float2Int(s2)
      return doArithmetic(
        intS1 / intS2,
        strip(Math.pow(10, digitLength(s2) - digitLength(s1))),
        '*'
      )
    }
    case '+': {
      const maxDL = Math.max(digitLength(s1), digitLength(s2))
      const transformS1 = s1 * Math.pow(10, maxDL) //interger number
      const transformS2 = s2 * Math.pow(10, maxDL)
      return (transformS1 + transformS2) / Math.pow(10, maxDL)
    }
    case '-': {
      const maxDL = Math.max(digitLength(s1), digitLength(s2))
      const transformS1 = s1 * Math.pow(10, maxDL) //interger number
      const transformS2 = s2 * Math.pow(10, maxDL)
      return (transformS1 - transformS2) / Math.pow(10, maxDL)
    }
  }
}

function transformToRPN(digitsArr: DigitsArr['calc']) {
  if (digitsArr.length === 0) return []
  let i = 0
  let res: string[] = []
  let stack = []
  while (i < digitsArr.length) {
    if (!digitsArr[i].iscalculator) {
      res.push(digitsArr[i].value)
    } else {
      if (
        stack.length === 0 ||
        opPriority[opConverion[digitsArr[i].value]] <
          opPriority[stack[stack.length - 1]]
      ) {
        stack.push(opConverion[digitsArr[i].value])
      } else {
        while (
          stack.length > 0 &&
          opPriority[opConverion[digitsArr[i].value]] >=
            opPriority[stack[stack.length - 1]]
        ) {
          res.push(stack.pop() as string)
        }
        stack.push(opConverion[digitsArr[i].value])
      }
    }
    i++
  }
  while (stack.length > 0) {
    res.push(stack.pop() as string)
  }
  return res
}

export function calculateRBN(digitsArr: DigitsArr['calc']) {
  const rbn = transformToRPN(digitsArr)

  if (rbn.length === 0) return 0
  let i = 0
  let stack: number[] = []
  while (i < rbn.length) {
    if (/^(-?[0-9.]+)|(-?[0-9.]+e[+|-][1-9]+)$/.test(rbn[i])) {
      stack.push(+rbn[i])
    } else {
      if (stack.length >= 2) {
        let e1 = stack.pop() as number
        let e2 = stack.pop() as number
        stack.push(doArithmetic(e2, e1, rbn[i] as '/' | '*' | '-' | '+'))
      }
    }
    i++
  }
  if (stack.length === 1) {
    return stack[0]
  } else {
    return NaN
  }
}
