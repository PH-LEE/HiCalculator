import Calculator from './Calculator/index'
import ResetCss from './resetCss'

const App = () => {
  return (
    <>
      <ResetCss />
      <div className='App'>
        <Calculator />
      </div>
    </>
  )
}

export default App
