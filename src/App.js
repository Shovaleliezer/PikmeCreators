import './style/main.scss'
import { useSelector } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Profile } from './pages/profile'
import { AddEvent } from './pages/addEvent'
import { Header } from './cmps/header'
import { Tickets } from './pages/tickets'
import { EventDetails } from './pages/event-details'
import { Menu } from "../src/cmps/menu"

function App() {
  const mode = useSelector((storeState) => storeState.generalModule.mode)
  document.body.classList.add(`back-${mode.type}`)
  return (
    <Router>
      <div className="app">
        <Header mode={mode} />
        <main className='main-layout'>
          <Routes>
            <Route path='/register' element={<AddEvent />} />
            <Route path='/profile' element={<Profile mode={mode} />} />
            <Route path='/tickets' element={<Tickets mode={mode} />} />
            <Route path='/event/:eventId' element={<EventDetails mode={mode} />} />
            <Route path='/' element={<Home mode={mode} />} />
          </Routes>
        </main>
      </div>
      <Menu mode={mode} />
    </Router>
  )
}

export default App;
