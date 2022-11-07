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
        dispatch(setFilter({ search: searchRef.current.value }))
        navigate("/")
    }

    return (
        <form onSubmit={onSearch} className={`${props.mode.type} border-${props.mode.type} search-bar`}>
            <button className={props.mode.type}><img className="search-icon" src={require('../style/imgs/search-icon.png')}/></button>
            <input className={props.mode.type} type='text' ref={searchRef} placeholder='search for upcoming events...' autoFocus />
            {props.addX && <span onClick={() => props.setIsSearch(false)} className="material-symbols-outlined clickable">close</span>}
        </form>
    )
}