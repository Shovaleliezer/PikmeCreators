import './style/main.scss'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

//pages
import { Home } from './pages/home'
import { Confirm } from './pages/confirm'
import { Profile } from './pages/profile'
import { Join } from './pages/join'
import { StreamWrapper } from './pages/stream-wrapper'

//cmps
import { Header } from './cmps/header'
import { Footer } from './cmps/footer'
import { Menu } from "../src/cmps/menu"
import { Popup } from "../src/cmps/popup"
import { UpperPopup } from "../src/cmps/upper-popup"

//tutorials
import { TutorialRegister } from './cmps/tutorial-register'
import { TutorialHome } from './cmps/tutorial-home'
import { TutorialCreate } from './cmps/tutorial-create'
import { TutorialStream } from './cmps/tutorial-stream'

//debug
import { resetGeneralState } from './store/actions/general.actions'
import { setStreamPhase,setHomePhase, setRegisterPhase } from './store/actions/tutorial.actions'



function App() {
  const dispatch = useDispatch()

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
          </Routes>
        </main>
        {/* <button className='reset' onClick={() => {dispatch(setStreamPhase(0))}}>DEBUG</button> */}
        <Footer />
      </div>
      <Menu />
      <Popup />
      <UpperPopup />

      <TutorialHome />
      <TutorialRegister />
      <TutorialCreate />
      <TutorialStream />

    </Router>
  )
}

export default App;