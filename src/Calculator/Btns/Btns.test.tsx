import Btns from './index'
import { btnsArray } from '../model'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('render Btns component', () => {
  const user = userEvent.setup()
  const mockClick = jest.fn((val) => val)

  beforeEach(() => {
    render(<Btns onClick={mockClick} />)
  })

  it('reander expected btn keys on page', () => {
    btnsArray.forEach((item) => {
      expect(screen.getByText(item.key)).toBeInTheDocument()
    })
  })

  it('test onclick prop to pass the correct operator', () => {
    btnsArray.forEach(async (item) => {
      await user.click(screen.getByText(item.key))
      expect(mockClick.mock.results[0].value).toBe(item.op)
    })
  })

  it('test hover css effect', () => {
    btnsArray.forEach(async (item) => {
      const btn = screen.getByText(item.key)
      await user.hover(btn)
      expect(btn).toHaveStyle(`
        color: yellow
      `)
    })
  })
})
