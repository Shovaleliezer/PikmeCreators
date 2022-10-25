import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { eventService } from "../services/eventService"
import { makeCommas, formatHour, formatDate } from "../services/utils"
import { setPopup } from "../store/actions/general.actions"
import Timer from "../cmps/timer"

export function EventDetails(props) {
    const dispatch = useDispatch()
    const [event, setEvent] = useState(null)
    const [tickets, setTickets] = useState(1)
    const user = useSelector((state) => state.user)
    const { eventId } = useParams()

    useEffect(() => {
        loadEvent()
    }, [])

    const loadEvent = async () => {
        const loadedEvent = await eventService.getById(eventId)
        setEvent(loadedEvent)
    }

    const onInputClick = (ev) => {
        if (ev.target.value >= 0 && ev.target.value <= 9999) setTickets(Number(ev.target.value))
    }
    const onButtonClick = (value) => {
        if (Number(tickets + value) >= 1 && Number(tickets + value) <= 9999) setTickets(Number(tickets + value))
    }
    const buyTickets = async (teamChosen) => {
        if (!user.isConnected) {
            dispatch(setPopup('connect'))
            return
        }
        const eventt = await eventService.sellTickets(event._id, { tickets, teamChosen, buyerAddress: user.address })
        //todo: pop up purchase confirmed
    }

    if (!event) return <p>loading...</p>

    return (
        <section className={`event-details ${props.mode.type}`}>
            <img className="event-banner" src={event.banner}></img>
            <div className="title-position title-back"><p>{event.title}</p></div>
            <div className="title-position title-text"><p>{event.title}</p></div>

            <section className="event-upper">
                <h1>Price pool : {makeCommas((event.teamOneTickets + event.teamTwoTickets) * 5)}$</h1>
                <div className="detail-line">
                    <p>{formatDate(event.createdAt)}-{formatHour(event.createdAt)}</p>
                    <div className="detail-options" >
                        <span className="material-symbols-outlined">thumb_up</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">share</span>
                        <span className="material-symbols-outlined">more_horiz</span>
                    </div>
                </div>
            </section>

            <Timer eventDate={new Date(event.date)} />

            <section className="buy-tickets">
                <div className="team-side">
                    <img src={event.teamOneIcon} />
                    <div className={`pay color-${props.mode.type}`} onClick={() => buyTickets('teamOne')}>Buy tickets : {makeCommas(tickets * 5)}$</div>
                </div>
                <div className="team-side">
                    <div className="vs"><p>Vs</p></div>
                    <div className="edit">
                        <div className="noselect" onClick={() => onButtonClick(-1)}>-</div>
                        <input className={props.mode.type} type='number' value={tickets} step={1} onChange={onInputClick} />
                        <div className="noselect" onClick={() => onButtonClick(1)}>+</div>
                    </div>
                </div>
                <div className="team-side">
                    <img src={event.teamTwoIcon} />
                    <div className={`pay color-${props.mode.type}`} onClick={() => buyTickets('teamTwo')}>Buy tickets : {makeCommas(tickets * 5)}$</div>
                </div>
            </section>

        </section>
    )
}