import { useDispatch } from 'react-redux'
import { setPopup } from '../store/actions/general.actions'
export function EventCard({ev}) {
    const dispatch = useDispatch()
    return (
        <div className='event-card'>
            <div className="event-upper">
                <div><img src={require('../style/imgs/edit-icon.png')}/><p>Edit your Stream info</p></div>
                <p onClick={()=>{dispatch(setPopup('edit'))}} className='main-color clickable'>Edit</p>
            </div>
            <div className="event-inner">
                    <img src={require('../style/imgs/valorant-purchase.png')} />
                    {/* <img src={require(`../style/imgs/event-card/${ev.game}.png`)}/> */}
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
                        <p>{ev.opponent}</p>
                        <p>{ev.date}</p>
                        <p style={{color:ev.status==='approved'? '#04C300' : '#F37F13'}}>{ev.status}</p>
                    </div>
                </div>
        </div>
    )
}