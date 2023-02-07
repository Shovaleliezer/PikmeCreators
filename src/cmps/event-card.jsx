import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setPopup, setPopupEvent, setUpperPopup, setStreamInfo } from '../store/actions/general.actions'
import { formatDateHour, getRoute } from '../services/utils'
import { eventService } from '../services/event.service'
import { userService } from '../services/userService'
export function EventCard({ ev, creator }) {

    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false)

    const copy = (to) => {
        if (to === 'clients') navigator.clipboard.writeText('https://pickmetv.onrender.com/#/event/' + ev._id)
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
        if (ev.fund) {
            if (!ev.approved) return <>
                <p onClick={openEdit}>Edit</p>
                <p onClick={() => setIsOpen(true)}>Delete</p>
            </>
            else if (!ev.over) return <>
                <p onClick={() => dispatch(setStreamInfo(ev))}><NavLink to='/stream-control'>Manage</NavLink></p>
                <p onClick={() => { copy('clients') }}>Share</p>
            </>
            return <p onClick={() => deleteEvent(true)}>Delete</p>
        }
        return <>
            {(!ev.approved && ev.players[0].walletAddress === creator.walletAddress) && <>
                <p onClick={openEdit}>Edit</p>
                <p onClick={() => copy('creators')}>Share</p>
                <p onClick={() => setIsOpen(true)}>Delete</p>
            </>}
            {(ev.approved && !ev.over) && <>
                <p onClick={() => dispatch(setStreamInfo(ev))}><NavLink to='/stream-control'>Manage</NavLink></p>
                <p onClick={() => { copy('clients') }}>Share</p>
            </>}
            {ev.over && <p onClick={() => deleteEvent(true)}>Delete</p>}
        </>

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
                    {!ev.fund && <p>Category: </p>}
                    <p>Game: </p>
                    {! ev.fund && <p>players </p>}
                    <p>Date:</p>
                    <p>Status:</p>
                </div>
                <div className="details">
                    {!ev.fund && <p>{ev.category}</p>}
                    <p>{ev.game}</p>
                    {!ev.fund && <p>{ev.players.length}</p>}
                    <p>{formatDateHour(ev.date)}</p>
                    <p style={{ color: (ev.over ? 'red' : (ev.approved ? '#04C300' : '#F37F13')) }}>
                        {(ev.over ? 'Over' : (ev.approved ? ev.fund ? ev.fund.current + '/' + ev.fund.target + 'BNB' : 'approved' : 'waiting'))}
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