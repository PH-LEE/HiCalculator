import styled from 'styled-components'
import { btnsArray } from '../model'
import { BtnsProps } from './model'

const StyledBtnsContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 355px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`

const StyledBtns = styled.div`
  color: white;
  font-size: 24px;
  line-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  &:hover {
    font-size: 28px;
    color: yellow;
  }
`

const Btns = ({ onClick }: BtnsProps) => {
  return (
    <StyledBtnsContainer>
      {btnsArray.map((item) => (
        <StyledBtns
          role='btn-div'
          aria-label={item.op}
          key={item.key}
          onClick={() => onClick(item.op)}
        >
          {item.key}
        </StyledBtns>
      ))}
    </StyledBtnsContainer>
  )
}

export default Btns
