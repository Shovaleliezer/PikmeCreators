import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setPopup, setPopupEvent, setUpperPopup, setStreamInfo } from '../store/actions/general.actions'
import { formatDateHour, getRoute } from '../services/utils'
import { eventService } from '../services/event.service'
export function EventCard({ ev, creator }) {
    console.log('eee', ev)

    const dispatch = useDispatch()

    const copy = (to) => {
        if (to === 'clients') navigator.clipboard.writeText(getRoute() + ev._id)
        else navigator.clipboard.writeText(getRoute() + 'confirm/' + ev._id)
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
                    {/* change to stronger condition ! */}
<<<<<<< HEAD
                    {!ev.over && <>
                        {(!ev.approved && ev.players[0].walletAddress === creator.walletAddress) && <>
                            <p onClick={openEdit}>Edit</p>
                            <p onClick={copy}>Share</p>
                            <p onClick={() => dispatch(setStreamInfo(ev))}><NavLink to='/stream-control'>Manage</NavLink></p>
                            <p onClick={deleteEvent}>Delete</p>
                        </>}
                        {(ev.approved && ev.players[0].walletAddress === creator.walletAddress) && <>
                            <p onClick={() => { copy('clients') }}>Share</p>
                        </>}
=======
                    {((!ev.approved && !ev.over )&& ev.players[0].walletAddress===creator.walletAddress) && <>
                        <p onClick={openEdit}>Edit</p>
                        <p onClick={copy}>Share</p>
                        <p onClick={()=>dispatch(setStreamInfo(ev))}><NavLink to='/stream-control'>Manage</NavLink></p>
                        <p onClick={deleteEvent}>Delete</p>
                    </>}
                    {(ev.approved && !ev.over ) && <>
                        <p onClick={()=>{copy('clients')}}>Share</p>
                        {(ev.players[0].walletAddress===creator.walletAddress) && <p onClick={()=>dispatch(setStreamInfo(ev))}><NavLink to='/stream-control'>Manage</NavLink></p>}
>>>>>>> 273ec36f7658ff50e5d9fe08c95b582b295ed3b5
                    </>}
                    {ev.over && <p onClick={deleteEvent}>Delete</p>}
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
<<<<<<< HEAD
                    {!ev.over && <p style={{ color: ev.approved ? '#04C300' : '#F37F13' }}>{ev.approved ? 'Approved' : 'Waiting'}</p>}
                    {ev.over && <p style={{ color: '#F31313' }}>Over</p>}
=======
                    <p style={{ color: (ev.over? 'red': (ev.approved ? '#04C300' : '#F37F13'))}}>{(ev.over? 'Over': (ev.approved ? 'approved' : 'waiting'))}</p>
>>>>>>> 273ec36f7658ff50e5d9fe08c95b582b295ed3b5
                </div>
            </div>
        </div>
    )
}