import { NavLink } from "react-router-dom"
export function Header() {

    return (
        <nav className="center-h bar">
            <NavLink className="undecorate" to='/'>Friends</NavLink>
            <NavLink className="undecorate" to='/messages'>Messages</NavLink>
            <NavLink className="undecorate" to='/register'>Log in</NavLink>
        </nav>
    )
}