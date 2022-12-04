import { useDispatch } from 'react-redux'
import { setPopup, setPopupEvent, setStreamInfo, setUpperPopup } from '../store/actions/general.actions'
import { formatDateHour } from '../services/utils'
import { eventService } from '../services/event.service'
export function EventCard({ ev }) {

    const dispatch = useDispatch()
    console.log(ev)

    const copy = () => {
        navigator.clipboard.writeText('http://localhost:3000/#/confirm/' + ev._id)
        dispatch(setUpperPopup('copied'))
    }

    const deleteEvent = async () => {
        const confirm = await eventService.deleteEvent(ev._id)
        if (confirm) window.location.reload()
    }

    const openEdit = () => {
        dispatch(setPopupEvent(ev))
        dispatch(setPopup('edit'))
    }

    return (
        <div className='event-card'>
            <div className="event-upper">
                <h3>Event Info</h3>
                <div>
                    {!ev.approved && <>
                        <p onClick={openEdit}>Edit</p>
                        <p onClick={copy}>Share</p>
                        <p onClick={deleteEvent}>Delete</p>
                    </>}
                </div>

            </div>
            <div className="event-inner">
                <img src={require(`../style/imgs/event-card/${ev.game}.png`)} />
                <div className="headers">
                    <p>Category: </p>
                    <p>Game: </p>
                    <p>players </p>
                    <p>Date:</p>
                    <p>Status:</p>
                </div>
                <div className="details">
                    <p>{ev.category}</p>
                    <p>{ev.game}</p>
                    <p>{ev.players.length}</p>
                    <p>{formatDateHour(ev.date)}</p>
                    <p style={{ color: ev.approved ? '#04C300' : '#F37F13' }}>{ev.approved ? 'approved' : 'waiting'}</p>
                </div>
            </div>
        </div>
    )
}