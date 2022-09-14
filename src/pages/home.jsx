import { useState, useEffect } from 'react'
import { eventService } from '../services/eventService'

export function Home() {
    const [events, setEvents] = useState([])


    useEffect(() => {
        loadEvents()
    }, [])

    const loadEvents = async (filter) => {
        const loadedEvents = await eventService.query(filter)
        console.log(loadedEvents)
        setEvents(loadedEvents)
    }

    return (
        <div>
            <section className=''>
                {events.map(ev => ev.title)}
            </section>
        </div>
    )
}