import './style/main.scss'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Profile } from './pages/profile'
import { AddEvent } from './pages/addEvent'
import { Header } from './cmps/header'
import {Tickets} from './pages/tickets'
import {EventDetails} from './pages/event-details'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path='/register' element={<AddEvent />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/tickets' element={<Tickets />} />
            <Route path='/event/:eventId' element={<EventDetails />} />
            <Route path='/' element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;
