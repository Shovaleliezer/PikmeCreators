import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { SearchBar } from "./search-bar"
import { setFilter } from '../store/actions/general.actions'
import { toggleMenu } from "../store/actions/general.actions"
import { useNavigate } from "react-router-dom"

export function Header(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    let isMobile = window.innerWidth < 980 ? true : false

    const resetFilter = () => {
        dispatch(setFilter(''))
    }

    const filterClick = (filter)=>{
        dispatch(setFilter({search:filter}))
        navigate('/')
    }

    return (
        <>
            <nav className={`header ${props.mode.type} noselect`}>
                <NavLink onClick={resetFilter} className={`undecorate ${props.mode.type} hover-main`} to='/'><img className="logo" src={require('../style/imgs/logo.png')} /></NavLink>
                    
                <SearchBar mode={props.mode} />

                <div className="left-bar">
                    {! isMobile && <>
                   <img onClick={()=>{filterClick('fifa')}} className="bar-logo" src={require('../style/imgs/fifa-logo.png')} />
                    <img onClick={()=>{filterClick('valorant')}} className="bar-logo" src={require('../style/imgs/valorant-logo.png')} />
                    <img title="watch stream" className="bar-logo" src={require(`../style/imgs/stream-icon-${props.mode.type}.png`)} />
                    <NavLink to='/profile'><img className='header-user-img' src={(user && user.image) ? user.image : require('../style/imgs/user-icon.png')} /></NavLink></>}
                    <span className="material-symbols-outlined icons clickable hover-main" onClick={() => dispatch(toggleMenu())}>menu</span>
                </div>
            </nav>

            {isMobile && <nav className={`footer-mobile ${props.mode.type}`}>
                <NavLink onClick={resetFilter} to='/'><img className='home-icon' src={require(`../style/imgs/home-icon-${props.mode.type}.png`)} /></NavLink>
                <NavLink onClick={resetFilter} to='/'><img src={require(`../style/imgs/stream-icon-${props.mode.type}.png`)} /></NavLink>
                <NavLink to='/profile'><img className='circle' src={(user && user.image) ? user.image : require('../style/imgs/user-icon.png')} /></NavLink>
            </nav>}
        </>
    )
}