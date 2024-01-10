import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPopupEvent, setUpperPopup, setStreamInfo } from '../store/actions/general.actions'
import { formatDate, formatHour, getRoute } from '../services/utils'
import { eventService } from '../services/event.service'
import { userService } from '../services/user.service'
const arrPercent = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05, 0]

export function EventCardShow({ ev, creator }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [percent, setPercent] = useState(ev.fund ? ev.fund.percent : 0)
    const [won, setWon] = useState(ev.fund ? ev.fund.won : 0)

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

    const getOptions = () => {
        if (ev.approved && !ev.cancelled && !ev.over) return <>
            <p className='main-color' onClick={() => loadEventForStream(ev)}>Stream</p>
            <p onClick={() => { copy('clients') }}>Share</p>
        </>
        return <p onClick={() => deleteEvent(true)}>Delete</p>
    }

    const getStatus = () => {
        if (ev.cancelled) return 'Cancelled'
        if (ev.over) return 'Over'
        if (ev.approved) return 'Approved'
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

    const handlePercent = (ev) => {
        const { value } = ev.target
        setPercent(value)
    }

    const handleWon = (ev) => {
        const { value } = ev.target
        if ((Number(value) < 0)) {
            dispatch(setUpperPopup('invalidPrize'))
            return
        }
        setWon(value)
    }

    const setDistribution = async () => {
        try {
            if (Number(percent) === 0 || Number(won) === 0) {
                const confirm = await eventService.payCreator(ev._id, { payZero: true })
                if (confirm) window.location.reload()
                else dispatch(setUpperPopup('errorServer'))
                return
            }
            let link
            if (process.env.NODE_ENV === 'production') {
                if (window.innerWidth < 1000) link = 'https://metamask.app.link/dapp/pikme.tv/#/pay/'
                else link = 'https://pikme.tv/#/pay/'
            }
            else link = 'http://localhost:3001/#/pay/'
            link += ev._id
            const confirm = await eventService.setDistribution(ev._id, { prize: won, percent })
            if (confirm) window.open(link, "_blank")
        }

        catch {
            dispatch(setUpperPopup('errorServer'))
        }

        finally {
            setIsOpen(false)
        }
    }

    const { show } = ev

    return (<>
        <div className='event-card'>
            <div className="event-upper">
                <h3>Event Info</h3>
                <div>{getOptions()}</div>
            </div>
            <div className="event-inner">
                <img src={ show.img } />
                <div className="headers">
                    <p>Name:</p>
                    <p>Sold:</p>
                    <p>Date:</p>
                    <p>Time:</p>
                    <p>Status:</p>
                </div>
                <div className="details">
                    <p>{show.performerName}</p>
                    <p></p>
                    <p>{formatDate(ev.date)}</p>
                    <p>{formatHour(ev.date)}</p>
                    <p style={{ color: (ev.over ? 'red' : (ev.approved ? '#04C300' : '#F37F13')) }}>
                        {getStatus()}
                    </p>
                </div>
            </div>
        </div>
        {isOpen === 'delete' && <div className="simple-popup">
            <img src={require('../style/imgs/error.png')} />
            <h1>Delete the event?</h1>
            <p>This action cannot be undone. are you sure you want to delete the event?</p>
            <div className='buttons-wrapper'>
                <div className='bolder' onClick={() => setIsOpen(false)}>Cancel</div>
                <div className='lighter' onClick={() => deleteEvent(false)}>Delete</div>
            </div>
        </div>}
        {isOpen === 'pay' && <div className="simple-popup">
            <img src={require('../style/imgs/error.png')} />
            <h1>Pay for event ?</h1>
            <p>You agreed to pay {(ev.fund.won * ev.fund.percent).toFixed(3)} BNB</p>
            <p>You may also edit it here before payment:</p>
            <div className="percent-wrapper">
                <div>
                    <p>Prize:</p>
                    <input type='number' placeholder="20BNB" value={won} onChange={handleWon} />
                </div>
                <div>
                    <p>Share:</p>
                    <select value={percent} onChange={handlePercent}>
                        {arrPercent.map((p) => <option key={p} value={p}>{(p * 100).toFixed(0)}%</option>)}
                    </select>

                </div>
            </div>
            <div className='buttons-wrapper' value={String(won)}>
                <div className='bolder' onClick={() => setIsOpen(false)}>Cancel</div>
                <div className='lighter' onClick={setDistribution}>Pay</div>
            </div>
        </div>}
    </>)
}
