import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { eventService } from '../services/eventService'
import { setFilter } from '../store/actions/general.actions'
import { EventBox } from '../cmps/event-box'

export function Home(props) {
    const dispatch = useDispatch()
    const [events, setEvents] = useState([])
    const [item, setItem] = useState(0)
    const { filter } = useSelector((storeState) => storeState.generalModule)
    

    useEffect(() => {
        loadEvents(filter)
    }, [filter])

    

    const arrowClick = (val) => {
        if (item + val >= events.length || item + val < 0) return
        setItem(item + val)
    }
    

    const loadEvents = async (filter) => {
        let loadedEvents = await eventService.query(filter)
        setEvents(loadedEvents)
    }

    if (!events) return <p>loading...</p>

    return (
        <div className={props.mode.type}>

            
                <div onClick={() => { arrowClick(-1) }} className='next-event up noselect'><span className="material-symbols-outlined">arrow_upward</span></div>
                <div onClick={() => { arrowClick(1) }} className='next-event down noselect'><span className="material-symbols-outlined">arrow_downward</span></div>
            

            {events.length === 0 && <div className="center not-found">
                <img className="no-history" src={require('../style/imgs/no-results.png')} />
                <p>Oops! it seems there are no results that matches your search...</p>
                <p onClick={() => dispatch(setFilter(''))} className='main-color clickable'>View all events</p>
            </div>}
        </div>
    )
}
