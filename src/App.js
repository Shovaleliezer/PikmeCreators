import './style/main.scss'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

//pages
import { Home } from './pages/home'
import { Confirm } from './pages/confirm'
import { Profile } from './pages/profile'
import { Join } from './pages/join'
import { StreamWrapper } from './pages/stream-wrapper'
import { ControlPanel } from './pages/control-panel'

//cmps
import { Header } from './cmps/header'
import { Footer } from './cmps/footer'
import { Menu } from "../src/cmps/menu"
import { Popup } from "../src/cmps/popup"
import { UpperPopup } from "../src/cmps/upper-popup"

//tutorials
import { TutorialRegister } from './cmps/tutorial-register'
import { TutorialHome } from './cmps/tutorial-home'
import { TutorialStream } from './cmps/tutorial-stream'

function App() {
  return (
    <Router>
      <div className="app">
        <Header/>
        <main className='main-layout'>
          <Routes>
            <Route path='/profile' element={<Profile />} />
            <Route path='/confirm/:id' element={<Confirm />} />
            <Route path='/' element={<Home />} />
            <Route path='/stream-control' element={<StreamWrapper />} />
            <Route path='/join' element={<Join />} />
            <Route path='/admin' element={<ControlPanel />}/>
          </Routes>
        </main>
        <Footer />
      </div>
      <Menu />
      <Popup />
      <UpperPopup />
      <TutorialHome />
      <TutorialRegister />
      <TutorialStream />

    </Router>
  )
}

export default App