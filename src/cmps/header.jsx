import { useDispatch } from "react-redux"
import { toggleMode } from "../store/actions/general.actions"
import { NavLink } from "react-router-dom"
import { SearchBar } from "./search-bar"

export function Header(props) {
    const dispatch = useDispatch()
    let isMobile = window.innerWidth < 700 ? true : false

    return (
        <>
            <nav className={`header ${props.mode.type} noselect`}>
                {!isMobile ?
                    <div>
                        <img className="logo" src={require('../style/imgs/logo.png')} />
                        <NavLink className={`undecorate ${props.mode.type}`} to='/'>Home</NavLink>
                        <NavLink className={`undecorate ${props.mode.type}`} to='/profile'>Profile</NavLink>
                        <NavLink className={`undecorate ${props.mode.type}`} to='/tickets'>Tickets</NavLink>
                    </div>
                    : <img className="logo" src={require('../style/imgs/logo.png')} />}
                <SearchBar mode={props.mode} />
                <div>
                    <span className="material-symbols-outlined icons clickable">notifications</span>
                    <span className="material-symbols-outlined icons clickable" onClick={() => dispatch(toggleMode())}>menu</span>
                </div>

            </nav>
                {isMobile && <nav className={`footer-mobile ${props.mode.type}`}>
                    <NavLink className={props.mode.type} to='/'><span style={{fontSize:'28px'}} className="material-symbols-outlined">home</span></NavLink>
                    <NavLink className={props.mode.type} to='/tickets'><span style={{fontSize:'28px'}} className="material-symbols-outlined">sd_card</span></NavLink>
                    <NavLink className={props.mode.type} to='/profile'>profile</NavLink>
                </nav>}
        </>
    )
}