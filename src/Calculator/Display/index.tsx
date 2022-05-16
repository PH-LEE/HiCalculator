import styled from 'styled-components'
import { DisplayProps } from './model'

const StyledDisplayContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 155px;
  margin: 10px 0 20px 0;
  padding: 2px 16px;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`
const StyledDisplayInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 4px 0px;
  overflow: hidden;
  color: #f1f1f1;
  font-size: 32px;
  line-height: 48px;
  white-space: nowrap;
`

const Display = ({ display }: DisplayProps) => {
  return (
    <StyledDisplayContainer>
      <StyledDisplayInner role='result-div' aria-label={display || '0'}>
        {display || '0'}
      </StyledDisplayInner>
    </StyledDisplayContainer>
  )
}

export default Display
