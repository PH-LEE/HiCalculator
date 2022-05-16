export interface DigitsArr {
  calc: Array<{
    dpflag: boolean
    value: string
    iscalculator: boolean
  }>
  display: string
}

export const btnsArray = [
  { key: 'AC', op: 'ac' },
  { key: 'CE', op: 'ce' },
  { key: '%', op: 'dh' },
  { key: '÷', op: 'divide' },
  { key: '8', op: '8' },
  { key: '9', op: '9' },
  { key: '7', op: '7' },
  { key: '×', op: 'mul' },
  { key: '4', op: '4' },
  { key: '5', op: '5' },
  { key: '6', op: '6' },
  { key: '-', op: 'minus' },
  { key: '1', op: '1' },
  { key: '2', op: '2' },
  { key: '3', op: '3' },
  { key: '+', op: 'plus' },
  { key: '0', op: '0' },
  { key: '00', op: 'd0' },
  { key: '.', op: 'dp' },
  { key: '=', op: 'eq' },
]
