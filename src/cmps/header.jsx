import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { SearchBar } from "./search-bar"
import { setFilter } from '../store/actions/general.actions'
import { toggleMenu } from "../store/actions/general.actions"

export function Header(props) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    let isMobile = window.innerWidth < 700 ? true : false

    const resetFilter = () => {
        dispatch(setFilter(''))
    }

    return (
        <>
            <nav className={`header ${props.mode.type} noselect`}>
                    {!isMobile ?
                    <div>
                        <img className="logo" src={require('../style/imgs/logo.png')} />
                        <NavLink onClick={resetFilter} className={`undecorate ${props.mode.type} hover-main`} to='/'>Home</NavLink>
                        <NavLink className={`undecorate ${props.mode.type} hover-main`} to='/profile'>Profile</NavLink>
                        <NavLink className={`undecorate ${props.mode.type} hover-main`} to='/register'>Tickets</NavLink>
                    </div>
                    : <img className="logo" src={require('../style/imgs/logo.png')} />}
                <SearchBar mode={props.mode} />
                <div>
                    {/* <img className="mattic-icon" src={require('../style/imgs/mattic.png')}/>
                    <span>2000$</span> */}
                    <span className="material-symbols-outlined icons clickable hover-main" onClick={() => dispatch(toggleMenu())}>menu</span>
                </div>
            </nav>

            {isMobile && <nav className={`footer-mobile ${props.mode.type}`}>
                <NavLink onClick={resetFilter} className={props.mode.type} to='/'><span style={{ fontSize: '28px' }} className="material-symbols-outlined">home</span></NavLink>
                <NavLink className={props.mode.type} to='/tickets'><span style={{ fontSize: '28px' }} className="material-symbols-outlined">sd_card</span></NavLink>
                <NavLink className={props.mode.type} to='/profile'><img src={user? user.image: require('../style/imgs/user-icon.png')} /></NavLink>
            </nav>}
        </>
    )
}