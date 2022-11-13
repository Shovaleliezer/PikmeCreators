import './style/main.scss'
import { useSelector } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import {Home} from './pages/home'
import { Profile } from './pages/profile'
import { Header } from './cmps/header'
import { LandingPage } from './pages/landing-page'
import { CreatorHome } from './pages/creator/creator-home'
import { CreatorCreate } from './pages/creator/creator-create'
import { CreatorProfile } from './pages/creator/creator-profile'
import { Footer } from './cmps/footer'
import { Tickets } from './pages/tickets'
import { Menu } from "../src/cmps/menu"
import {Popup} from "../src/cmps/popup"

function App() {
  const mode = useSelector((storeState) => storeState.generalModule.mode)
  const {tutorialDone} = useSelector((storeState) => storeState.generalModule)
  document.body.classList=[`back-${mode.type}`]
  return (
    <Router>
      <div className="app">
        <Header mode={mode} />
        <main className='main-layout'>
          {tutorialDone ? <Routes>
            <Route path='/creator/home' element={<CreatorHome />} />
            <Route path='/creator/create' element={<CreatorCreate />} />
            <Route path='/creator/profile' element={<CreatorProfile />} />
            <Route path='/profile' element={<Profile mode={mode} />} />
            <Route path='/tickets' element={<Tickets mode={mode} />} />
            <Route path='/' element={<Home mode={mode} />} />
          </Routes> : <LandingPage />}
        </main>
      <Footer />
      </div>
      <Menu mode={mode} />
      <Popup mode={mode} />
    </Router>
  )
}

export default App;
