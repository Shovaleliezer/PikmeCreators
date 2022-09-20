import { NavLink } from "react-router-dom"
export function EventBox(props) {
    const {_id,banner,title} = props.ev
    return (
        <div className='event-preview clickable' >
            <NavLink to={`/event/${_id}`} className={`undecorate ${props.mode.type}`}>
                <img src={banner} />
                <h2>{title}</h2>
                <p>watch the full game for only 5$</p>
            </NavLink>
        </div>
    )
}