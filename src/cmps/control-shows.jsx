import { useState, useEffect, useRef } from "react"
import { adminService } from "../services/admin.service"
import { Error } from "../pages/error"
import { formatDateHour } from "../services/utils"

export function ControlShows() {
    const [history, setHistory] = useState([])
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
            console.log(shows)
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

    const getStatus = (show) => {
        switch (show.status) {
            case 'waiting':
                return <td style={{color:'yellow'}}>'Pending...</td>
            case 'approved':
                return <td style={{color:'green'}}>Approved</td>
            case 'cancelled':
                return <td style={{color:'red'}}>Cancelled</td>
            case 'ended':
                return <td style={{color:'blue'}}>Ended</td>
            default:
                return <td style={{color:'yellow'}}>Pending...</td>
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
                    <tbody style={{ zIndex: '1001' }}>
                        {history.map((show, idx) => <tr key={idx}>
                            <td>{show.performerName}</td>
                            <td>{show.title}</td>
                            <td>{formatDateHour(show.date)}</td>
                            <td>239</td>
                            {getStatus(show)}
                            <td>Actions</td>
                        </tr>)}
                    </tbody>
                </table>}
                {loader && <div style={{ margin: 'auto', position: 'relative' }}><div ref={targetRef} className="loader loader-block"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>}

            </div>
        </>)
    }
    catch {
        return <Error />
    }
}