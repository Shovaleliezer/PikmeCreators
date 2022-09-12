// idan is gay s
import './style/main.scss'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import {Home} from './pages/home'
import {Messages} from './pages/messages'
import { Register } from './pages/register'
import {Header} from './cmps/header'
import {Footer} from './cmps/footer'

function App() {
  return (
    <Router>
        <div className="app">
          <Header/>
          <main>
          <Routes>
              <Route path='/register' element={<Register />} />
              <Route path='/messages' element={<Messages />} />
              <Route path='/' element={<Home />} />
            </Routes>
          </main>
          <Footer/>
        </div>
        </Router>
  )
}

export default App;
