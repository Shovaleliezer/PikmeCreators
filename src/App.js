import './style/main.scss'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { setIsConnected, setCreator, setAddress, resetState } from './store/reducers/userReducer'
import { userService } from './services/userService'
import { useEffect } from "react"

//pages
import { Home } from './pages/home'
import { Confirm } from './pages/confirm'
import { Profile } from './pages/profile'
import Creator from './pages/stream'
import { Join } from './pages/join'
import { Login } from './pages/login'

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
import { setStreamPhase,setRegisterPhase} from './store/actions/tutorial.actions'


function App() {
  const { mode, channel, type } = useSelector((storeState) => storeState.generalModule)
  const ethereum = window.ethereum
  const dispatch = useDispatch()

  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', async (accounts) => {
        if (accounts[0]) {
          const res = await userService.checkIsCreator(accounts[0])
          if (res) {
            const loadedCreator = await userService.addCreator(accounts[0], null)
            if (loadedCreator) dispatch(setCreator(loadedCreator))
            window.location = '#/'
          }
          dispatch(resetState())
          dispatch(setAddress(accounts[0]))
          dispatch(setIsConnected(true))
          window.location = '#/'
        }
        else {
          dispatch(resetState())
          window.location = '#/'
        }
      })
    }
  }, [])


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
            <Route path='/stream-control' element={<Creator channel={channel} type={type} />} />
            <Route path='/login' element={<Login/>} />
            <Route path='/join' element={<Join />} />
          </Routes>
        </main>
        {/* <button className='reset' onClick={()=>{dispatch(resetGeneralState());dispatch(resetState());dispatch(setStreamPhase(4))}}>RESET</button> */}
        <button className='reset' onClick={()=>{dispatch(setRegisterPhase(1))}}>DEBUG</button>
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
