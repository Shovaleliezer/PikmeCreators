import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { setUpperPopup, setStreamInfo } from "../store/actions/general.actions"
import { adminService } from "../services/admin.service"
import { Error } from "../pages/error"
import { formatDateHour } from "../services/utils"


export function ControlShows() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [history, setHistory] = useState([])
    const [popup, setPopup] = useState('')
    const [from, setFrom] = useState(0)
    const [error, setError] = useState(false)
    const [loader, setLoader] = useState(true)
    const targetRef = useRef(null)
    const debounce = useRef(false)

    useEffect(() => {
        window.addEventListener('scroll', loadMore)
        return () => window.removeEventListener('scroll', loadMore)
    }, [])

    useEffect(() => {
        loadHistory(from)
    }, [from])

    const loadHistory = async () => {
        try {
            const shows = await adminService.getShows(from)
            setHistory(history.concat(shows))
            if (shows.length < 10) setLoader(false)
        }
        catch {
            setError(true)
        }
    }

    const loadMore = () => {
        if (debounce.current) return
        if (!targetRef.current) {
            window.removeEventListener('scroll', loadMore)
            return
        }
        const rect = targetRef.current.getBoundingClientRect()
        if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
            debounce.current = true
            setTimeout(() => { debounce.current = false }, 800)
            setFrom((from) => from + 10)
        }
    }

    const accept = async (id) => {
        try {
            const accepted = await adminService.acceptShow(id)
            setHistory(history.map(show => show._id === id ? accepted : show))
        }
        catch {
            setUpperPopup('errorServer')
        }
    }

    const reject = async (id) => {
        try {
            await adminService.rejectShow(id)
            setHistory(history.filter(show => show._id !== id))
        }
        catch {
            setUpperPopup('errorServer')
        }
    }

    const cancel = async (id) => {
        try {
            const cancelled = await adminService.cancelShow(id)
            setHistory(history.map(show => show._id === id ? cancelled : show))
        }
        catch {
            setUpperPopup('errorServer')
        }
    }

    const getStatus = (status) => {
        switch (status) {
            case 'waiting':
                return <td style={{ color: 'yellow' }}>Pending...</td>
            case 'approved':
                return <td style={{ color: 'green' }}>Approved</td>
            case 'cancelled':
                return <td style={{ color: 'red' }}>Cancelled</td>
            case 'ended':
                return <td style={{ color: 'blue' }}>Ended</td>
            default:
                return <td style={{ color: 'yellow' }}>Pending...</td>
        }
    }

    const handleAction = (ev) => {
        const { name, className } = ev.target
        if (className === 'accept') accept(name)
        if (className === 'reject') reject(name)
        if (className === 'cancel') setPopup(name)
        if (className === 'button-stream') loadShowForStream(name)
    }

    const loadShowForStream = async (id) => {
        try {
            const showForStream = history.find(show => show._id === id)
            dispatch(setStreamInfo(showForStream))
            navigate('/stream-control')
        }
        catch {
            dispatch(setUpperPopup('errorLoadEvent'))
        }
    }

    if (error) return <Error />

    try {
        return (<>
            <div className="control-current control-history">
                <p className="list-count">Shows log : <span>{history.length}</span></p>
                {history.length > 0 && <table >
                    <thead>
                        <tr>
                            <td>Performer</td>
                            <td>Title</td>
                            <td>Date</td>
                            <td>Tickets</td>
                            <td>Status</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody style={{ zIndex: '1001' }} onClick={handleAction}>
                        {history.map((show, idx) => <tr key={idx}>
                            <td>{show.performerName}</td>
                            <td>{show.title}</td>
                            <td>{formatDateHour(show.date)}</td>
                            <td>{show.viewersCount}</td>
                            {getStatus(show.status)}
                            <td className="actions">
                                {show.status === 'waiting' && <><button name={show._id} className="reject">Reject</button>
                                    <button className="accept" name={show._id}>Accept</button></>}
                                {show.status === 'approved' && <> <button className="cancel" name={show._id}>Cancel</button>
                                    <button className="button-stream" name={show._id}>stream</button></>}
                            </td>
                        </tr>)}
                    </tbody>
                </table>}
                {loader && <div style={{ margin: 'auto', position: 'relative' }}><div ref={targetRef} className="loader loader-block"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>}

            </div>
            {popup && <>
                <div className="simple-popup">
                    <img src={require('../style/imgs/error.png')} />
                    <h1>Cancel show?</h1>
                    <p>By clicking confirm, the show will be cancelled and buyers will have to get a refund, are you sure you want to cancel?</p>
                    <div className='buttons-wrapper'>
                        <div className='lighter' onClick={() => setPopup(false)}>No</div>
                        <div className='bolder' onClick={() => { cancel(popup); setPopup(false) }}>confirm</div>
                    </div>
                </div>
                <div className="screen blur" onClick={() => setPopup(false)} />
            </>}
        </>)
    }
    catch {
        return <Error />
    }
}