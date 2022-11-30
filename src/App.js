import './style/main.scss'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { setIsConnected, setCreator, setAddress,resetState } from './store/reducers/userReducer'
import { userService } from './services/userService'
import { useEffect } from "react"
//pages
import { Home } from './pages/home'
import { Confirm } from './pages/confirm'
import { Profile } from './pages/profile'
import Creator from './pages/stream'
//cmps
import { Header } from './cmps/header'
import { Footer } from './cmps/footer'
import { Menu } from "../src/cmps/menu"
import { Popup } from "../src/cmps/popup"
import { UpperPopup } from "../src/cmps/upper-popup"


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
            Navigate('/')
          }
          dispatch(setAddress(accounts[0]))
          dispatch(setIsConnected(true))
        }
        else{
          dispatch(resetState())
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
          </Routes>
        </main>
        <Footer />
      </div>
      <Menu mode={mode} />
      <Popup mode={mode} />
      <UpperPopup />
    </Router>
  )
}

export default App;
