import { useState } from "react"
import { formatDate } from "../services/utils"

export function CurrentCard({ ev, endEvent, cancelEvent }) {
    const [popup, setPopup] = useState(false)
    const [selectedIdx, setSelectedIdx] = useState(0)
    return (<>
        <div className='current-card'>
            <div className="event-upper">
                <div className="name-wrapper">
                    <img src={ev.players[0].image} />
                    <h3>Event Info</h3>
                </div>
                <div>
                    <p onClick={() => setPopup('cancel')}>cancel</p>
                    <p onClick={() => setPopup('end')}>end</p>
                </div>
            </div>
            <div className="event-inner">
                <img src={require(`../style/imgs/event-card/${ev.game}.png`)} />
                <div className="headers">
                    <p>Type: </p>
                    <p>Game</p>
                    <p>players: </p>
                    <p>Starts at:</p>
                </div>
                <div className="details">
                    <p>{ev.fund ? 'Fund event' : 'Vs event'}</p>
                    <p>{ev.game}</p>
                    <p>{ev.players.length}</p>
                    <p>{formatDate(ev.date)}</p>
                </div>
            </div>
        </div>
        {popup === 'cancel' && <>
            <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                <h1>Cancel the event?</h1>
                <p>This action cannot be undone. are you sure you want to delete the event?</p>
                <div className='buttons-wrapper'>
                    <div className='lighter' onClick={() => setPopup(false)}>Close</div>
                    <div className='bolder' onClick={() => { cancelEvent(ev._id); setPopup(false) }}>Cancel</div>
                </div>
            </div>
            <div className="screen blur" onClick={() => setPopup(false)} />
        </>}
        {popup === 'end' && <>
            <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                <h1>Choose the winner</h1>
                <select>

                </select>
                <div className='buttons-wrapper'>
                    <div className='lighter' onClick={() => setPopup(false)}>Return</div>
                    <div className='bolder' onClick={() => { endEvent(ev._id); setPopup(false) }}>Confirm</div>
                </div>
            </div>
            <div className="screen blur" onClick={() => setPopup(false)} />
        </>}
    </>)
}