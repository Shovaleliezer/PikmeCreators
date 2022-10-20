import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { eventService } from '../services/eventService'
import { EventBox } from '../cmps/event-box'
import { FilterBar } from '../cmps/filter-bar'

export function Home(props) {
    const [events, setEvents] = useState([])
    const { filter } = useSelector((storeState) => storeState.generalModule)

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
            {events.length > 0 ? <section className='events-container'>
                {events.map(ev => <EventBox ev={ev} mode={props.mode} key={ev._id} />)}
            </section> :
                <div className="center not-found">
                    <img className="no-history" src={require('../style/imgs/no-results.png')} />
                    <p>No matches to display yet, would you like to <NavLink className={`${props.mode.type} main-color`} to='/'>buy some?</NavLink></p>
                </div>}

        </div>
    )
}
