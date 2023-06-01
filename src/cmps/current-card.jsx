import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { adminService } from "../services/admin.service"
import { eventService } from "../services/event.service"
import { setUpperPopup, setPopup, setPopupStats } from "../store/actions/general.actions"
import { formatDate, formatHour } from "../services/utils"
const arrPercent = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05, 0]

export function CurrentCard({ ev, endEvent, cancelEvent }) {
    const dispatch = useDispatch()
    const [popup, setLocalPopup] = useState(false)
    const [selectedIdx, setSelectedIdx] = useState(0)
    const [share, setShare] = useState(!(ev.over && !ev.shareWithCommunity))
    const prizeRef = useRef()
    const percentRef = useRef()

    const handleEnd = () => {
        if (ev.fund) endEvent(ev._id, 'fund', { won: prizeRef.current.value, percent: percentRef.current.value })
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
    if (ev.over && ev.fund && !ev.fund.creatorPaid) status = 'payment'
    if (ev.over && ev.fund && ev.fund.creatorPaid) status = 'Payed'
    let color = 'white'
    if (status === 'Started') color = '#F29B00'
    if (status === 'Live') color = '#F37F13'
    if (status === 'Ended') color = 'red'
    if (status === 'payment') color = 'gold'
    if (status === 'Payed') color = 'lime'

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
                    {(!ev.fund || (ev.fund && ev.fund.creatorPaid)) && <p onClick={() => setLocalPopup('end')}>end</p>}
                </div>
            </div>
            <div className="event-inner">
                <img src={require(`../style/imgs/event-card/${ev.game}.png`)} />
                <div className="headers">
                    <p>Type: </p>
                    {!ev.fund && <p>players: </p>}
                    {ev.fund && <>
                        <p>Investors:</p>
                        <p>Goal:</p>
                        <p>Max prize:</p></>}
                    <p>Date: </p>
                    <p>Time: </p>
                    <p>status:</p>

                </div>
                <div className="details">
                    <p>{ev.fund ? 'Fund event' : 'Vs event'}</p>
                    {!ev.fund && <p>{ev.players.length}</p>}
                    {ev.fund && <>
                        <p>{Object.keys(ev.fund.investors).length}</p>
                        <p><><span style={{ color: ev.fund.current === ev.fund.target ? '#04C300' : 'white' }}>{ev.fund.current.toFixed(2)}</span ><span style={{ color: 'white' }}>/</span><span>{ev.fund.target + ' BNB'}</span></></p>
                        <p>{ev.fund.prize} BNB</p>
                    </>}
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
                    <div className='lighter' onClick={() => setLocalPopup(false)}>Back</div>
                    <div className='bolder' onClick={() => { cancelEvent(ev._id); setLocalPopup(false) }}>Confirm</div>
                </div>
            </div>
            <div className="screen blur" onClick={() => setLocalPopup(false)} />
        </>}

        {popup === 'end' && <>
            <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                {ev.fund && <>
                    <h2>Review fund event</h2>
                    <p>The creator won <span className="main-color">{ev.fund.won} BNB</span> and Chose to share <span className="main-color"> {ev.fund.won * ev.fund.percent} BNB</span> ({ev.fund.percent * 100}%).
                        You can also edit the distribution to his supporters here (leave blank to use the cretor's choice):</p>
                    <div className="percent-wrapper">
                        <div>
                            <p>Prize:</p>
                            <input type='number' ref={prizeRef} className='prize' placeholder={ev.fund.won + ' BNB'} />
                        </div>
                        <div>
                            <p>Share:</p>
                            <select ref={percentRef}>
                                <option key={'900'} value={ev.fund.percent}>{ev.fund.percent * 100}%</option>
                                {arrPercent.map((p) => <option key={p} value={p}>{(p * 100).toFixed(0)}%</option>)}
                            </select>

                        </div>
                    </div>
                </>}
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