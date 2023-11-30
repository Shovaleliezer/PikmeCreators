import { adminService } from "../services/admin.service"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { formatHour } from "../services/utils"
import { Error } from '../pages/error'
import { PopupPlayers } from "./popup-players"
import { PopupView } from "./popup-view"
import { setUpperPopup, setPopup } from "../store/actions/general.actions"

export function ControlWaiting() {
    const dispatch = useDispatch()
    const [waiting, setWaiting] = useState(null)
    const [error, setError] = useState(false)
    const [popup, setLocalPopup] = useState(false)

    useEffect(() => {
        loadWaiting()
    }, [])

    const loadWaiting = async () => {
        try {
            const waiting = await adminService.getWaitingEvents()
            setWaiting(waiting)
        }
        catch {
            setError(true)
        }
    }

    const formatDate = (date) => {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
        const d = new Date(date)
        return `${d.getDate()} ${monthNames[+date.slice(5, 7) - 1]} ${d.getFullYear()}, ${formatHour(date)}`
    }

    const accept = async (ev) => {
        if (!ev.fund && ev.players.length < 2) {
            dispatch(setUpperPopup('noPlayers'))
            return
        }
        const id = ev._id
        try {
            await adminService.acceptEvent(id)
            await loadWaiting()
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const reject = async (id) => {
        try {
            await adminService.rejectEvent(id)
            await loadWaiting()
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const getVideo = (vid) => {
        if (!vid) return <span style={{ color: 'White' }} className="material-symbols-outlined">videocam_off</span>
        if (vid === 'error') return <span style={{color:'red'}} onClick={() => setLocalPopup('error')} className="material-symbols-outlined">error</span>
        return <span className="material-symbols-outlined" onClick={() => dispatch(setPopup(vid))}>play_circle</span>
    }

    if (error) return <Error />

    if (!waiting) return <div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>

    return (<>
        <div className="control-wrapper">
            <p className="list-count">Waiting events : <span>{waiting.length}</span></p>
            {waiting.length > 0 && <div className="list">
                {waiting.map((ev, idx) => <div key={idx} className="event">
                    <div className="left" >
                        <img className="game" src={require(`../style/imgs/white-icons/${ev.game}.webp`)} />
                        <div className="details">
                            <div className="top">
                                <img src={ev.players[0].image} />
                                <p>{ev.players[0].nickName}</p>
                                {ev.players.length > 1 && <>
                                    <p>+</p>
                                    <div className="img-wrapper">
                                        {ev.players.slice(1, 4).map((pl, idx) => <img key={idx} src={pl.image} className={`img${idx}`} />)}
                                    </div>
                                    <p>{ev.players.length - 1} players</p>
                                </>}
                            </div>
                            <p>{formatDate(ev.date)}</p>
                        </div>

                    </div>
                    <div className="actions">
                        <span className="material-symbols-outlined" onClick={() => reject(ev._id)}>close</span>
                        <span onClick={() => accept(ev)} className="material-symbols-outlined">check</span>
                        <span onClick={() => setLocalPopup(ev)} className="material-symbols-outlined">visibility</span>
                        {getVideo(ev.video)}
                    </div>
                    {popup && popup.fund && <PopupView event={popup} setPopup={setLocalPopup} accept={accept} reject={reject} />}
                    {(typeof popup === 'object' && !popup.fund) && <PopupPlayers event={popup} players={popup.players} setPopup={setLocalPopup} accept={accept} reject={reject} />}
                    {popup === 'error' && <>
                        <div className="screen blur" onClick={() => setLocalPopup(false)} />
                        <section className='simple-popup' style={{ zIndex: '1001' }}>
                            <p>Error uploading creator's video</p>
                        </section>
                    </>}
                </div>)}
            </div>}
        </div>
    </>)
}