import { useState } from "react"
import { formatDate } from "../services/utils"

export function CurrentCard({ ev,end }) {
    const [popup, setPopup] = useState(false)
    return (<>
        <div className='current-card'>
            <div className="event-upper">
                <div className="name-wrapper">
                    <img src={ev.players[0].image} />
                    <h3>Event Info</h3>
                </div>
                <div>
                    <p>cancel</p>
                    <p>end</p>
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
        {isOpen && <div className="simple-popup">
            <img src={require('../style/imgs/error.png')} />
            <h1>Cancel the event?</h1>
            <p>This action cannot be undone. are you sure you want to delete the event?</p>
            <div className='buttons-wrapper'>
                <div className='bolder' onClick={() => setIsOpen(false)}>Cancel</div>
                <div className='lighter' onClick={() => deleteEvent(false)}>Delete</div>
            </div>
        </div>}
    </>)
}