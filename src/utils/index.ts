import { DigitsArr } from '../Calculator/model'
import { btnsArray } from '../Calculator/model'

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

function doArithmetic(s1: number, s2: number, op: '/' | '*' | '-' | '+') {
  switch (op) {
    case '*': {
      return s1 * s2
    }
    case '/': {
      return s1 / s2
    }
    case '+': {
      return s1 + s2
    }
    case '-': {
      return s1 - s2
    }
  }
}

export function transformToRPN(digitsArr: DigitsArr['calc']) {
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
  console.log('RPNepx', res)
  return res
}

export function calculateRBN(rbn: string[]) {
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
