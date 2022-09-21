import { useState, useEffect } from 'react'
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
        <div>
            <FilterBar mode={props.mode}/>
            <section className='events-container'>
                {events.map(ev => <EventBox ev={ev} mode={props.mode} key={ev._id} />)}
            </section>
        </div>
    )
}
