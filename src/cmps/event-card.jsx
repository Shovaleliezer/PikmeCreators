import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPopup, setPopupEvent, setUpperPopup, setStreamInfo } from '../store/actions/general.actions'
import { formatDate, formatHour, getRoute } from '../services/utils'
import { eventService } from '../services/event.service'
import { userService } from '../services/user.service'
export function EventCard({ ev, creator }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false)

    const copy = (to) => {
        if (to === 'clients') navigator.clipboard.writeText('pikme.tv/#/event/' + ev._id)
        else navigator.clipboard.writeText(getRoute() + 'confirm/' + ev._id)
        dispatch(setUpperPopup('copied'))
    }

    const deleteEvent = async (local) => {
        try {
            let confirm = local ? await userService.deleteCreatorEvent(ev._id, creator.walletAddress) : await eventService.deleteEvent(ev._id)
            if (confirm) window.location.reload()
        }
        catch {
            dispatch(setUpperPopup('errorDelete'))
        }
    }

    const openEdit = () => {
        dispatch(setPopupEvent(ev))
        dispatch(setPopup('edit'))
    }

    const getOptions = () => {
        if (ev.over || ev.cancelled) return <p onClick={() => deleteEvent(true)}>Delete</p>
        if (ev.fund) {
            if (ev.approved) return <>
                <p onClick={() => loadEventForStream(ev)}>Stream</p>
                <p onClick={() => { copy('clients') }}>Share</p>
            </>
            return <>
                <p onClick={openEdit}>Edit</p>
                <p onClick={() => setIsOpen(true)}>Delete</p>
            </>
        }
        else {
            if (ev.approved) return <>
                <p onClick={() => loadEventForStream(ev)}>Stream</p>
                <p onClick={() => { copy('clients') }}>Share</p>
            </>
            if (ev.players[0].walletAddress === creator.walletAddress) return <>
                <p onClick={openEdit}>Edit</p>
                <p onClick={() => copy('creators')}>Share</p>
                <p onClick={() => setIsOpen(true)}>Delete</p>
            </>
        }
    }

    const getStatus = () => {
        if (ev.cancelled) return 'Cancelled'
        if(ev.over) return 'Over'
        if (ev.approved) {
            if (ev.fund) return <><span style={{color:ev.fund.current === ev.fund.target ? '#04C300' : 'white'}}>{ev.fund.current.toFixed(2)}</span ><span style={{color:'white'}}>/</span><span>{ev.fund.target + 'BNB'}</span></>
            return 'Approved'
        }
        return 'Waiting...'
    }

    const loadEventForStream = async () => {
        try {
            const eventForStream = await eventService.getGlobalEvent(ev._id)
            dispatch(setStreamInfo(eventForStream))
            navigate('/stream-control')
        }
        catch {
            dispatch(setUpperPopup('errorLoadEvent'))
        }
    }

    return (<>
        <div className='event-card'>
            <div className="event-upper">
                <h3>Event Info</h3>
                <div>{getOptions()}</div>
            </div>
            <div className="event-inner">
                <img src={require(`../style/imgs/event-card/${ev.game}.png`)} />
                <div className="headers">
                    <p>Game: </p>
                    {ev.fund && <p>Investors:</p>}
                    {!ev.fund && <p>players </p>}
                    <p>Date:</p>
                    <p>Time:</p>
                    <p>Status:</p>
                </div>
                <div className="details">
                    <p>{ev.game}</p>
                    {ev.fund && <p>{Object.keys(ev.fund.investors).length}</p>}
                    {!ev.fund && <p>{ev.players.length}</p>}
                    <p>{formatDate(ev.date)}</p>
                    <p>{formatHour(ev.date)}</p>
                    <p style={{ color: (ev.over ? 'red' : (ev.approved ? '#04C300' : '#F37F13'))}}>
                        {getStatus()}
                    </p>
                </div>
            </div>
        </div>
        {isOpen && <div className="simple-popup">
            <img src={require('../style/imgs/error.png')} />
            <h1>Delete the event?</h1>
            <p>This action cannot be undone. are you sure you want to delete the event?</p>
            <div className='buttons-wrapper'>
                <div className='bolder' onClick={() => setIsOpen(false)}>Cancel</div>
                <div className='lighter' onClick={() => deleteEvent(false)}>Delete</div>
            </div>
        </div>}
    </>)
}
