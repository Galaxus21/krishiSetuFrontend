import './App.css'
import HeroPage from './scenes/HeroPage.scenes'
import Header from './components/header.component'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HeroPage />} />
          {/* <Route path="/" element={<></>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App