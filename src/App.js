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
import { setStreamPhase, setRegisterPhase } from './store/actions/tutorial.actions'



function App() {
  const dispatch = useDispatch()
  const { mode } = useSelector((storeState) => storeState.generalModule)
  const { streamPhase, registerPhase, homePhase } = useSelector((storeState) => storeState.tutorialModule)

  // if ((streamPhase <= 3 && streamPhase > 0) || (registerPhase > 0 && registerPhase >= 3) || homePhase === 1) {
  //   document.body.style.overflow = "hidden"
  // }
  // else {
  //   document.body.style.overflow = "auto"
  // }

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
            <Route path='/stream-control' element={<StreamWrapper />} />
            <Route path='/join' element={<Join />} />
          </Routes>
        </main>
        {/* <button className='reset' onClick={() => {localStorage.clear()}}>DEBUG</button> */}
        <Footer />
      </div>
      <Menu mode={mode} />
      <Popup mode={mode} />
      <UpperPopup />

      <TutorialHome />
      <TutorialRegister />
      <TutorialCreate />
      <TutorialStream />

    </Router>
  )
}

export default App;
// import { setIsConnected, setCreator, setAddress, resetState } from './store/reducers/userReducer'
// import { userService } from './services/userService'
// import { useEffect } from "react"
// const ethereum = window.ethereum
// useEffect(() => {
  //   if (ethereum) {
  //     ethereum.on('accountsChanged', async (accounts) => {
  //       if (accounts[0]) {
  //         const res = await userService.checkIsCreator(accounts[0])
  //         if (res) {
  //           const loadedCreator = await userService.addCreator(accounts[0], null)
  //           if (loadedCreator) dispatch(setCreator(loadedCreator))
  //           window.location = '#/'
  //         }
  //         dispatch(resetState())
  //         dispatch(setAddress(accounts[0]))
  //         dispatch(setIsConnected(true))
  //         window.location = '#/'
  //       }
  //       else {
  //         dispatch(resetState())
  //         window.location = '#/'
  //       }
  //     })
  //   }
  // }, [])

