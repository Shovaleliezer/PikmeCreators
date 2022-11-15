import './style/main.scss'
import { useSelector } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

//pages
import {Home} from './pages/home'
import { Header } from './cmps/header'
import { Create } from './pages/create'
import { Profile } from './pages/profile'
import { Footer } from './cmps/footer'

//cmps
import { Menu } from "../src/cmps/menu"
import { Popup } from "../src/cmps/popup"

function App() {
  const mode = useSelector((storeState) => storeState.generalModule.mode)
  document.body.classList = [`back-${mode.type}`]
  return (
    <Router>
      <div className="app">
        <Header mode={mode}/>
        <main className='main-layout'>
          <Routes>
            <Route path='/create' element={<Create />} />
            <Route path='/profile' element={<Profile />} />
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
