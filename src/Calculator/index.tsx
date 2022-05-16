import { useState } from 'react'
import styled from 'styled-components'
import Btns from './Btns/index'
import Display from './Display/index'
import { DigitsArr } from './model'
import { calculateRBN, transformToRPN } from '../utils/index'
import { btnsArray } from './model'

const StyledContainer = styled.div`
  border-radius: 8px;
  width: 356px;
  padding: 10px 12px;
  background-image: linear-gradient(
    180deg,
    #2f6ed3 5%,
    #5095e4 20%,
    #5095e4 60%,
    #2f6ed3 95%
  );
  margin: 0 auto;
`

const StyledLogo = styled.div`
  display: flex;
  margin-left: 20px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 120px;
  height: 120px;
  & .logoF {
    font-size: 32px;
    font-weight: 700;
  }
  & .logoS {
    font-size: 18px;
    font-weight: 400;
    line-height: 23px;
  }
`

const StyledCalculator = styled.div`
  width: 100%;
  height: 560px;
  padding: 5px 16px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`

const useCalulatorOperate = () => {
  const defaultDigitsStr: DigitsArr = {
    calc: [],
    display: '',
  }
  const [digitsStr, setDigitsStr] = useState(defaultDigitsStr)

  const onClick = (op: string) => {
    let calLength = digitsStr.calc.length
    let lastCal = digitsStr.calc[calLength - 1]

    if (lastCal && lastCal.value === 'NaN') {
      if (!(op === btnsArray[0].op || op === btnsArray[1].op)) {
        return
      }
    }

    function pushOperator(key: string) {
      let tempArr = { ...digitsStr }
      //if empty we only accept '-' as started
      if (digitsStr.calc.length === 0 && !digitsStr.display) {
        if (key !== btnsArray[11].key) return
        tempArr.calc.push({
          dpflag: false,
          value: key,
          iscalculator: false, //treat as negative number sign
        })
        tempArr.display += key
        //if first is - we dont accpet any calculator
      } else if (
        digitsStr.calc.length === 1 &&
        lastCal.value === btnsArray[11].key
      ) {
        return
      } else {
        //is number then push calculator
        if (!lastCal.iscalculator) {
          tempArr.calc.push({
            dpflag: false,
            value: key,
            iscalculator: true,
          })
          tempArr.display += ` ${key} `
          // * / replace other, +- replace eachother and if * / before, add - after
        } else {
          if (key === lastCal.value) return
          if (
            key === btnsArray[11].key &&
            (lastCal.value === btnsArray[3].key ||
              lastCal.value === btnsArray[7].key)
          ) {
            // last is * or / and key is -, push into arr
            tempArr.calc.push({
              dpflag: false,
              value: key,
              iscalculator: false, //treat as negative number sign
            })
            tempArr.display += key
          } else {
            tempArr.calc[calLength - 1].value = key
            tempArr.display = tempArr.display.slice(0, -3) + ` ${key} `
          }
        }
      }
      setDigitsStr(tempArr)
    }
    function pushNumeral(key: string) {
      let tempArr = { ...digitsStr }
      if (digitsStr.calc.length === 0 && !digitsStr.display) {
        //can't start with 00
        if (key === btnsArray[17].key) return
        tempArr.calc.push({
          dpflag: key === btnsArray[18].key,
          value: key,
          iscalculator: false,
        })
        tempArr.display += key
      } else {
        //last is calculator, push into arr
        if (lastCal.iscalculator) {
          //can't start with 00
          if (key === btnsArray[17].key) return
          tempArr.calc.push({
            dpflag: key === btnsArray[18].key,
            value: key,
            iscalculator: false,
          })
          tempArr.display += key
        } else {
          //if start with 0, can't input more 0 or 00
          if (
            (key === btnsArray[17].key || key === btnsArray[16].key) &&
            lastCal.value === btnsArray[16].key
          ) {
            return
          }
          //is .
          if (key === btnsArray[18].key && lastCal.dpflag) return
          if (key === btnsArray[18].key) {
            tempArr.calc[calLength - 1].dpflag = true
          }
          //if start with 0 and input other number, need to be replaced
          if (lastCal.value === btnsArray[16].key) {
            tempArr.calc[calLength - 1].value =
              tempArr.calc[calLength - 1].value.slice(0, -1) + key
            tempArr.display = tempArr.display.slice(0, -1) + key
          } else {
            tempArr.calc[calLength - 1].value += key
            tempArr.display += key
          }
        }
      }

      setDigitsStr(tempArr)
    }
    switch (op) {
      case btnsArray[0].op: {
        //ac
        setDigitsStr(defaultDigitsStr)
        break
      }
      case btnsArray[1].op: {
        //ae
        let tempArr = { ...digitsStr }
        if (calLength > 0 && !!digitsStr.display) {
          if (lastCal.iscalculator || lastCal.value === 'NaN') {
            //if calculator pop calc and remove ' + ' charactor
            tempArr.calc.pop()
            tempArr.display = tempArr.display.slice(0, -3)
          } else {
            //if not calculator and string length >1
            if (lastCal.value.length > 1) {
              //if dpflag true and last charactor is '.'
              if (
                lastCal.dpflag &&
                lastCal.value[lastCal.value.length - 1] === btnsArray[18].key
              ) {
                tempArr.calc[calLength - 1].dpflag = false
              }
              tempArr.calc[calLength - 1].value = tempArr.calc[
                calLength - 1
              ].value.slice(0, -1)
              //if str length <= 1, pop the calc
            } else {
              tempArr.calc.pop()
            }
            tempArr.display = tempArr.display.slice(0, -1)
          }
        }
        setDigitsStr(tempArr)
        break
      }
      case btnsArray[2].op: {
        // %
        const numberVal = calculateRBN(transformToRPN(digitsStr.calc))
        const divHudVal = numberVal / 100
        //let display show readable result
        let value =
          divHudVal.toString().length >= 7
            ? divHudVal.toExponential(7)
            : divHudVal
        let strValue = value.toString()
        setDigitsStr({
          calc: [
            {
              dpflag: numberVal % 100 !== 0,
              value: strValue,
              iscalculator: false,
            },
          ],
          display: strValue,
        })
        break
      }
      case btnsArray[3].op: {
        // /
        pushOperator(btnsArray[3].key)
        break
      }
      case btnsArray[4].op: // 7
        pushNumeral(btnsArray[4].key)
        break
      case btnsArray[5].op: // 8
        pushNumeral(btnsArray[5].key)
        break
      case btnsArray[6].op: // 9
        pushNumeral(btnsArray[6].key)
        break
      case btnsArray[7].op: // *
        pushOperator(btnsArray[7].key)
        break
      case btnsArray[8].op: // 4
        pushNumeral(btnsArray[8].key)
        break
      case btnsArray[9].op: // 5
        pushNumeral(btnsArray[9].key)
        break
      case btnsArray[10].op: // 6
        pushNumeral(btnsArray[10].key)
        break
      case btnsArray[11].op: // -
        pushOperator(btnsArray[11].key)
        break
      case btnsArray[12].op: // 1
        pushNumeral(btnsArray[12].key)
        break
      case btnsArray[13].op: // 2
        pushNumeral(btnsArray[13].key)
        break
      case btnsArray[14].op: // 3
        pushNumeral(btnsArray[14].key)
        break
      case btnsArray[15].op: // +
        pushOperator(btnsArray[15].key)
        break
      case btnsArray[16].op: // 0
        pushNumeral(btnsArray[16].key)
        break
      case btnsArray[17].op: // 00
        pushNumeral(btnsArray[17].key)
        break
      case btnsArray[18].op: // .
        pushNumeral(btnsArray[18].key)
        break
      case btnsArray[19].op: // ans
        const numberVal = calculateRBN(transformToRPN(digitsStr.calc))
        //let display show readable result
        let value =
          numberVal.toString().length >= 7
            ? numberVal.toExponential(7)
            : numberVal
        let strValue = value.toString()
        setDigitsStr({
          calc: [
            {
              dpflag: /^(?:0?\.[0-9]+|[1-9]+\.[0-9]+)$/.test(strValue),
              value: strValue,
              iscalculator: false,
            },
          ],
          display: strValue,
        })
        break
    }
  }
  return { digitsStr, onClick }
}

const Calculator = () => {
  const { onClick, digitsStr } = useCalulatorOperate()
  return (
    <div>
      <StyledLogo>
        <p className='logoF'>Hi!</p>
        <p className='logoS'>Calculator</p>
      </StyledLogo>
      <StyledContainer>
        <StyledCalculator>
          <Display display={digitsStr.display} />
          <Btns onClick={onClick} />
        </StyledCalculator>
      </StyledContainer>
    </div>
  )
}

export default Calculator
