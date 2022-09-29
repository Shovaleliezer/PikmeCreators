import { useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setFilter } from '../store/actions/general.actions'

export function SearchBar(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const searchRef = useRef()

    const onSearch = (ev) => {
        ev.preventDefault()
        dispatch(setFilter(searchRef.current.value))
        navigate("/")
    }

    return (
        <form onSubmit={onSearch} className={props.mode.type}>
            <input className={`${props.mode.type} border-${props.mode.type}`} type='text' ref={searchRef}/>
            <button className={`${props.mode.type} border-${props.mode.type} clickable`}><span className="material-symbols-outlined">search</span></button>
        </form>
    )
}