import { useState } from 'react'
import { eventService } from '../services/eventService'
 
export function Home() {
    const [events,setEvents] = useState([])

    const loadEvents = async(filter) =>{
        const loadedEvents = await eventService.query(filter)
        setEvents(loadedEvents)
    }

    return (
        <div>
            <section className=''>

            </section>
        </div>
    )
}