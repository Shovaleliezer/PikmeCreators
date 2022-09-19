import { NavLink } from "react-router-dom"
export function Header() {

    return (
        <nav className="center-h bar">
            <NavLink className="undecorate" to='/'>Hrffome</NavLink>
            <NavLink className="undecorate" to='/profile'>Profile</NavLink>
            <NavLink className="undecorate" to='/tickets'>Tickets</NavLink>
            <NavLink className="undecorate" to='/register'>Add event</NavLink>
        </nav>
    )
}