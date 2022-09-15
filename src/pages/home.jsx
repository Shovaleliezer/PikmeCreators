import { useState, useEffect } from 'react'
import { eventService } from '../services/eventService'

export function Home() {
    const [events, setEvents] = useState([])


    useEffect(() => {
        loadEvents()
    }, [])

    const loadEvents = async (filter) => {
        const loadedEvents = await eventService.query(filter)
        setEvents(loadedEvents)
    }

    return (
        <div>
            <section className='events-container'>
                {events.map(ev => 
                <div className='event-preview'>
                    <img src={ev.banner}/>
                    <h2>{ev.title}</h2>
                    <p>watch the full game for only 5$</p>
                </div>)}
            </section>
        </div>
    )
}