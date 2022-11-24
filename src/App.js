import './style/main.scss'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { setIsConnected, setNickName, setImage, setEvents, setStats, setAbout, setAddress, resetState } from './store/reducers/userReducer'
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


function App() {
  const { mode, channel, type } = useSelector((storeState) => storeState.generalModule)
  const ethereum = window.ethereum
  const dispatch = useDispatch()

  const connectWallet = async (account) => {
    try {
      const res = await userService.addCreator(account)
      if (res) {
        dispatch(setAbout(res.about))
        dispatch(setAddress(res.walletAddress))
        dispatch(setNickName(res.nickName))
        dispatch(setIsConnected(true))
        dispatch(setImage(res.image))

      }
      else {
        dispatch(setIsConnected(false))
      }
    } catch (error) {
      dispatch(setIsConnected(false))
    }
  }

  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', async (accounts) => {
        if (accounts[0]) {
          await connectWallet(accounts[0])
          window.location = '/';
        }
        else {
          dispatch(setIsConnected(false))
          dispatch(resetState())
          // swtich to landing page route
          window.location = '/';
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
    </Router>
  )
}

export default App;
