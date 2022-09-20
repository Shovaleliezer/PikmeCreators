import { NavLink } from "react-router-dom"
import { SearchBar } from "./search-bar"

export function Header(props) {

    return (
        <nav className={`header ${props.mode.type}`}>
            <div>
                <img className="logo" src={require('../style/imgs/logo.png')} />
                <NavLink className={`undecorate ${props.mode.type}`} to='/'>Home</NavLink>
                <NavLink className={`undecorate ${props.mode.type}`} to='/messages'>Profile</NavLink>
                <NavLink className={`undecorate ${props.mode.type}`} to='/tickets'>Tickets</NavLink>
            </div>
            <SearchBar mode={props.mode} />
            <div>
                <span className="material-symbols-outlined icons clickable">notifications</span>
                <span className="material-symbols-outlined icons clickable">menu</span>  
            </div>
        </nav>
    )
}