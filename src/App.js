import './style/main.scss'
import { useSelector } from 'react-redux'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Profile } from './pages/profile'
import { AddEvent } from './pages/addEvent'
import { Header } from './cmps/header'
import {Tickets} from './pages/tickets'
import {EventDetails} from './pages/event-details'

function App() {
  const mode = useSelector((storeState) => storeState.generalModule.mode)
  return (
    <Router>
      <div className="app">
        <Header mode={mode}/>
        <main>
          <Routes>
            <Route path='/register' element={<AddEvent />} />
            <Route path='/profile' element={<Profile mode={mode}/>} />
            <Route path='/tickets' element={<Tickets mode={mode}/>} />
            <Route path='/event/:eventId' element={<EventDetails mode={mode}/>} />
            <Route path='/' element={<Home mode={mode}/>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;
