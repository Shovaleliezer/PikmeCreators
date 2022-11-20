import { useDispatch } from 'react-redux'
import { setPopup,setPopupEvent} from '../store/actions/general.actions'
import {formatDateHour} from '../services/utils'

export function EventCard({ev}) {
    const dispatch = useDispatch()
    return (
        <div className='event-card'>
            <div className="event-upper">
                <div><img src={require('../style/imgs/edit-icon.png')}/><p>Edit your Stream info</p></div>
                {ev.status === 'approved' ? <p className='main-color clickable'>Manage</p> :
                <p onClick={()=>{dispatch(setPopupEvent(ev));dispatch(setPopup('edit'))}} className='main-color clickable'>Edit</p>}
            </div>
            <div className="event-inner">
                    <img src={require(`../style/imgs/event-card/${ev.game}.png`)}/>
                    <div className="headers">
                        <p>Category: </p>
                        <p>Game:  </p>
                        <p>Opponent: </p>
                        <p>Date:</p>
                        <p>Status:</p>
                    </div>
                    <div className="details">
                        <p>{ev.category}</p>
                        <p>{ev.game}</p>
                        <p style={{color:ev.opponent ? '#E63D4A' : '#F37F13'}} >{ev.opponent? ev.opponent : 'pending...'}</p>
                        <p>{formatDateHour(ev.date)}</p>
                        <p style={{color:ev.status==='approved'? '#04C300' : '#F37F13'}}>{ev.status==='approved'? 'approved' : 'pending...'}</p>
                    </div>
                </div>
        </div>
    )
}