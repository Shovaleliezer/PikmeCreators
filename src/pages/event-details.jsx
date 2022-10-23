import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { eventService } from "../services/eventService"
import { makeCommas } from "../services/utils"
import Timer from "../cmps/timer"
export function EventDetails(props) {
    const [event, setEvent] = useState(null)
    const [tickets, setTickets] = useState(1)
    const { eventId } = useParams()

    useEffect(() => {
        loadEvent()
    }, [])

    const loadEvent = async () => {
        const loadedEvent = await eventService.getById(eventId)
        console.log(loadedEvent)
        setEvent(loadedEvent)
    }

    const onInputClick = (ev) => {
        if (ev.target.value >= 0 && ev.target.value <= 9999) setTickets(Number(ev.target.value))
    }
    const onButtonClick = (value) => {
        if (Number(tickets + value) >= 1 && Number(tickets + value) <= 9999) setTickets(Number(tickets + value))
    }
    const buyTickets = () => {
        console.log(tickets)
    }
    if (!event) return <p>loading...</p>

    return (
        <section className={`event-details ${props.mode.type}`}>
            <img className="event-banner" src={event.banner}></img>
            <div className="title-position title-back"><p>{event.title}</p></div>
            <div className="title-position title-text"><p>{event.title}</p></div>
            <Timer eventDate={new Date(event.date)} />
            <div className="buy-tickets">
                <div className="edit">
                    <div className="noselect" onClick={() => onButtonClick(-1)}>-</div>
                    <input className={props.mode.type} type='number' value={tickets} step={1} onChange={onInputClick} />
                    <div className="noselect" onClick={() => onButtonClick(1)}>+</div>
                </div>
                <div className={`pay color-${props.mode.type}`} onClick={buyTickets}>Buy tickets : {makeCommas(tickets * 5)}$</div>
            </div>
        </section>
    )
}