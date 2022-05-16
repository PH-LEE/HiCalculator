import { render, screen } from '@testing-library/react'
import Display from './index'

describe('render Display component', () => {
  it('initial display', () => {
    render(<Display display='' />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
  it('passing display value as "99"', () => {
    render(<Display display='99' />)
    expect(screen.getByText('99')).toBeInTheDocument()
  })
})
