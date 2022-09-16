import { useState, useEffect } from "react"
import { useParams } from "react-router"
export function EventDetails() {
    const [event, setEvent] = useState(null)
    const { eventId } = useParams()
    useEffect(() => {
        console.log(eventId)
    }, [])


    return (
        <div>
            hello details
        </div>

    )
}