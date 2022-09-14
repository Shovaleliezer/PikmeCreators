import { NavLink } from "react-router-dom"
export function Header() {

    return (
        <nav className="center-h bar">
            <NavLink className="undecorate" to='/'>home</NavLink>
            <NavLink className="undecorate" to='/messages'>profile</NavLink>
            <NavLink className="undecorate" to='/tickets'>tickets</NavLink>
            <NavLink className="undecorate" to='/register'>add event</NavLink>
        </nav>
    )
}