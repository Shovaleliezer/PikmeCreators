import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { adminService } from "../services/admin.service"
import { eventService } from "../services/event.service"
import { setUpperPopup, setPopup, setPopupStats } from "../store/actions/general.actions"
import { formatDate, formatHour } from "../services/utils"

export function CurrentCard({ ev, endEvent, cancelEvent }) {
    const dispatch = useDispatch()
    const [popup, setLocalPopup] = useState(false)
    const [selectedIdx, setSelectedIdx] = useState(0)
    const [share, setShare] = useState(ev.shareWithCommunity)
    const prize = useRef()

    const handleEnd = () => {
        if (ev.fund) endEvent(ev._id, 'fund', prize.current.value)
        else endEvent(ev._id, 'vs', ev.players[selectedIdx])
        setLocalPopup(false)
    }

    const handleSelected = (e) => {
        setSelectedIdx(e.target.value)
    }

    const changeShare = async () => {
        try {
            await adminService.changeShare(ev._id)
            setShare(true)
            setLocalPopup(false)
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const loadAnalytics = async () => {
        try {
            const analytics = await eventService.getAnalytics(ev._id)
            dispatch(setPopupStats(analytics))
            dispatch(setPopup('stats'))
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    let status = 'Upcoming'
    if (new Date(Date.now()) > new Date(ev.date)) status = 'Started'
    if (ev.creatorStarted) status = 'Live'
    if (ev.over) status = 'Ended'
    let color = 'white'
    if (status === 'Started') color = '#F29B00'
    if (status === 'Live') color = '#F37F13'
    if (status === 'Ended') color = 'red'

    return (<>
        <div className='current-card'>
            <div className="event-upper">
                <div className="name-wrapper">
                    <img src={ev.players[0].image} />
                    <h3>{ev.players[0].nickName}</h3>
                </div>
                <div>
                    {!share && <img className="clickable" src={require('../style/imgs/error.png')} onClick={() => setLocalPopup('share')} />}
                    {!ev.fund && <p onClick={loadAnalytics}>Info</p>}
                    <p onClick={() => setLocalPopup('cancel')}>cancel</p>
                    <p onClick={() => setLocalPopup('end')}>end</p>
                </div>
            </div>
            <div className="event-inner">
                <img src={require(`../style/imgs/event-card/${ev.game}.png`)} />
                <div className="headers">
                    <p>Type: </p>
                    {!ev.fund && <p>players: </p>}
                    {ev.fund && <>
                    <p>Investors:</p>
                    <p>Goal:</p></>}
                    <p>Date: </p>
                    <p>Time: </p>
                    <p>status:</p>
                    
                </div>
                <div className="details">
                    <p>{ev.fund ? 'Fund event' : 'Vs event'}</p>
                    {!ev.fund && <p>{ev.players.length}</p>}
                    {ev.fund && <>
                    <p>{ Object.keys(ev.fund.investors).length}</p>
                    <p><><span style={{color:ev.fund.current === ev.fund.target ? '#04C300' : 'white'}}>{ev.fund.current.toFixed(2)}</span ><span style={{color:'white'}}>/</span><span>{ev.fund.target + ' BNB'}</span></></p></>}
                    <p>{formatDate(ev.date)}</p>
                    <p>{formatHour(ev.date)}</p>
                    <p style={{ color }}>{status}</p>
                </div>
            </div>
        </div>
        {popup === 'cancel' && <>
            <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                <h1>Cancel the event?</h1>
                <p>This action cannot be undone. are you sure you want to delete the event?</p>
                <div className='buttons-wrapper'>
                    <div className='lighter' onClick={() => setLocalPopup(false)}>Close</div>
                    <div className='bolder' onClick={() => { cancelEvent(ev._id); setLocalPopup(false) }}>Cancel</div>
                </div>
            </div>
            <div className="screen blur" onClick={() => setLocalPopup(false)} />
        </>}

        {popup === 'end' && <>
            <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                {ev.fund && <div className="wrapper">
                    <h2>Enter amount won</h2>
                    <input type='number' ref={prize} className='prize' placeholder="0.0 BNB" />
                </div>}

                {!ev.fund && <div className="wrapper">
                    <h2>Choose the winner</h2>
                    <select onChange={handleSelected} className="player-select">
                        {ev.players.map((player, idx) => <option key={idx} value={idx}>{player.nickName}</option>)}
                    </select>
                </div>}

                <div className='buttons-wrapper'>
                    <div className='lighter' onClick={() => setLocalPopup(false)}>Close</div>
                    <div className='bolder' onClick={handleEnd}>Confirm</div>
                </div>
            </div>
            <div className="screen blur" onClick={() => setLocalPopup(false)} />
        </>}

        {popup === 'share' && <>
            <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                <h1>Share with community</h1>
                <p>The creator chose to not share the earnings from this event with his community. Share with community anyway?</p>
                <div className='buttons-wrapper'>
                    <div className='lighter' onClick={() => setLocalPopup(false)}>Close</div>
                    <div className='bolder' onClick={changeShare}>Share</div>
                </div>
            </div>
            <div className="screen blur" onClick={() => setLocalPopup(false)} />
        </>}
    </>)
}