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


  document.body.classList = [`back-${mode.type}`]
  return (
   <div>
    <h1>hello</h1>
   </div>
  )
}

export default App;
