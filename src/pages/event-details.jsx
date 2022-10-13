import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { eventService } from "../services/eventService"
export function EventDetails() {
    const [event, setEvent] = useState(null)
    const { eventId } = useParams()
    useEffect(() => {
        loadEvent()
    }, [])

    const loadEvent = async()=>{
        const loadedEvent = await eventService.getById(eventId) 
        setEvent(loadedEvent)
    }
    if(!event) return <p>loading...</p>

    return (
        <div>
            {event.title}'s page
        </div>

    )
}