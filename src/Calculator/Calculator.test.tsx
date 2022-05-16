import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Calculator from './index'

describe('render the calculator', () => {
  beforeEach(() => render(<Calculator />))

  it('init render', () => {
    expect(screen.getByText(/Hi!/i)).toHaveTextContent('Hi!')
    expect(screen.getByText(/Calculator/i)).toHaveTextContent('Calculator')
    expect(screen.getByRole('result-div', { name: '0' })).toHaveTextContent('0')
  })
})

describe('do compute by clicking nums and operators', () => {
  beforeEach(() => {
    render(<Calculator />)
  })

  it('press 0 in first digit multiple times will get only a 0, and other number will replace it', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('btn-div', { name: '0' }))
    await user.click(screen.getByRole('btn-div', { name: '0' }))
    await user.click(screen.getByRole('btn-div', { name: '0' }))
    expect(screen.getByRole('result-div', { name: '0' })).toBeInTheDocument()
    await user.click(screen.getByRole('btn-div', { name: '8' }))
    expect(screen.getByRole('result-div', { name: '8' })).toBeInTheDocument()
    await user.click(screen.getByRole('btn-div', { name: 'ac' }))
    expect(screen.getByRole('result-div', { name: '0' })).toBeInTheDocument()
    await user.click(screen.getByRole('btn-div', { name: 'dp' }))
    await user.click(screen.getByRole('btn-div', { name: '7' }))
    expect(screen.getByRole('result-div', { name: '.7' })).toBeInTheDocument()
  })

  it('if result empty, only accept "-" as the first op', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('btn-div', { name: 'plus' }))
    await user.click(screen.getByRole('btn-div', { name: 'divide' }))
    await user.click(screen.getByRole('btn-div', { name: 'mul' }))
    expect(screen.getByRole('result-div', { name: '0' })).toBeInTheDocument()
    await user.click(screen.getByRole('btn-div', { name: 'minus' }))
    expect(screen.getByRole('result-div', { name: '-' })).toBeInTheDocument()
  })

  it('if first is "-" only accept num after', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('btn-div', { name: 'minus' }))
    await user.click(screen.getByRole('btn-div', { name: 'plus' }))
    await user.click(screen.getByRole('btn-div', { name: 'divide' }))
    await user.click(screen.getByRole('btn-div', { name: 'mul' }))
    expect(screen.getByRole('result-div', { name: '-' })).toBeInTheDocument()
    await user.click(screen.getByRole('btn-div', { name: '9' }))
    expect(screen.getByRole('result-div', { name: '-9' })).toBeInTheDocument()
  })

  it('mul & divide replace other ops and minus after them represent as number, plus and minus replace each other. ', async () => {
    const user = userEvent.setup()
    //mul & divide replace other ops
    await user.click(screen.getByRole('btn-div', { name: '9' }))
    await user.click(screen.getByRole('btn-div', { name: 'plus' }))
    await user.click(screen.getByRole('btn-div', { name: 'mul' }))
    await user.click(screen.getByRole('btn-div', { name: '3' }))
    expect(
      screen.getByRole('result-div', { name: '9 × 3' })
    ).toBeInTheDocument()
    //plus and minus replace each other
    await user.click(screen.getByRole('btn-div', { name: 'minus' }))
    await user.click(screen.getByRole('btn-div', { name: 'plus' }))
    await user.click(screen.getByRole('btn-div', { name: '2' }))
    expect(
      screen.getByRole('result-div', { name: '9 × 3 + 2' })
    ).toBeInTheDocument()
    //minus after mul & divide represent as number
    await user.click(screen.getByRole('btn-div', { name: 'divide' }))
    await user.click(screen.getByRole('btn-div', { name: 'minus' }))
    await user.click(screen.getByRole('btn-div', { name: '6' }))
    expect(
      screen.getByRole('result-div', { name: '9 × 3 + 2 ÷ -6' })
    ).toBeInTheDocument()
  })

  it('do calculate', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('btn-div', { name: '5' }))
    await user.click(screen.getByRole('btn-div', { name: '5' }))
    await user.click(screen.getByRole('btn-div', { name: '6' }))
    await user.click(screen.getByRole('btn-div', { name: '6' }))
    await user.click(screen.getByRole('btn-div', { name: 'mul' }))
    await user.click(screen.getByRole('btn-div', { name: '7' }))
    await user.click(screen.getByRole('btn-div', { name: '8' }))
    await user.click(screen.getByRole('btn-div', { name: 'divide' }))
    await user.click(screen.getByRole('btn-div', { name: '4' }))
    await user.click(screen.getByRole('btn-div', { name: 'plus' }))
    await user.click(screen.getByRole('btn-div', { name: '1' }))
    await user.click(screen.getByRole('btn-div', { name: '0' }))
    await user.click(screen.getByRole('btn-div', { name: 'minus' }))
    await user.click(screen.getByRole('btn-div', { name: '1' }))
    await user.click(screen.getByRole('btn-div', { name: '0' }))
    await user.click(screen.getByRole('btn-div', { name: 'mul' }))
    await user.click(screen.getByRole('btn-div', { name: 'dp' }))
    await user.click(screen.getByRole('btn-div', { name: '1' }))
    expect(
      screen.getByRole('result-div', { name: '5566 × 78 ÷ 4 + 10 - 10 × .1' })
    ).toBeInTheDocument()
    await user.click(screen.getByRole('btn-div', { name: 'eq' }))
    expect(
      screen.getByRole('result-div', {
        name: `${(5566 * 78) / 4 + 10 - 10 * 0.1}`,
      })
    ).toBeInTheDocument()
  })
})
