import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { eventService } from '../services/eventService'
import { setFilter } from '../store/actions/general.actions'
import { EventBox } from '../cmps/event-box'
import { FilterBar } from '../cmps/filter-bar'

export function Home(props) {
    const dispatch = useDispatch()
    const [events, setEvents] = useState([])
    const { filter } = useSelector((storeState) => storeState.generalModule)
    let gridView = '300px'
    if (events) {
        if (events.length > 10) gridView = '300px' //11+
        else if (events.length >= 5) gridView = '30%' //5-10
        else gridView = '100%' //6-
    }


    useEffect(() => {
        loadEvents(filter)
    }, [filter])

    const loadEvents = async (filter) => {
        const loadedEvents = await eventService.query(filter)
        setEvents(loadedEvents)
    }

    return (
        <div className={props.mode.type}>
            <FilterBar mode={props.mode} />
            {events.length > 0 ? <section className='events-container' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${gridView}, 1fr))`, width:'55vw', margin:'auto'}}>
                {events.map(ev => <EventBox ev={ev} mode={props.mode} key={ev._id} />)}
            </section> :
                <div className="center not-found">
                    <img className="no-history" src={require('../style/imgs/no-results.png')} />
                    <p>Oops! it seems there are no results that matches your search...</p>
                    <p onClick={() => dispatch(setFilter(''))} className='main-color clickable'>View all events</p>
                </div>}
        </div>
    )
}
