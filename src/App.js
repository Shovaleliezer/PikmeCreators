import './style/main.scss'
import { useSelector } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

//pages
import { Home } from './pages/home'
import { Confirm } from './pages/confirm'
import { Profile } from './pages/profile'

//cmps
import { Header } from './cmps/header'
import { Footer } from './cmps/footer'
import { Menu } from "../src/cmps/menu"
import { Popup } from "../src/cmps/popup"

function App() {
  const mode = useSelector((storeState) => storeState.generalModule.mode)
  document.body.classList = [`back-${mode.type}`]
  return (
    <Router>
      <div className="app">
        <Header mode={mode} />
        <main className='main-layout'>
          <Routes>
            <Route path='/profile' element={<Profile />} />
            <Route path='/confirm/:id' element={<Confirm />} />
            <Route path='/' element={<Home mode={mode} />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Menu mode={mode} />
      <Popup mode={mode} />
    </Router>
  )
}

export default App;
