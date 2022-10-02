import { NavLink } from "react-router-dom"
export function EventBox(props) {
    const {_id,banner,title,description} = props.ev
    let desc = description.length>120? description.slice(0,120)+'...' : description
    return (
        <div className='event-preview clickable' >
            <NavLink to={`/event/${_id}`} className={`undecorate ${props.mode.type}`}>
                <img src={banner} />
                <h2>{title}</h2>
                <p>{desc}</p>
            </NavLink>
        </div>
    )
}