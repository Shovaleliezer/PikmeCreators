import { useState, useEffect, useRef } from "react"
import { adminService } from "../services/admin.service"
import { Error } from "../pages/error"
import { formatDateHour } from "../services/utils"

export function ControlHistory() {
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
            const events = await adminService.getHistory(from)
            setHistory(history.concat(events))
            if (events.length < 10) setLoader(false)
        }
        catch {
            setError(true)
        }
    }

    const loadMore = () => {
        if (debounce.current) return
        if(!targetRef.current) {
            window.removeEventListener('scroll', loadMore)
            return
        }
        const rect = targetRef.current.getBoundingClientRect()
        if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
            debounce.current = true
            setTimeout(() => { debounce.current = false },800)
            console.log(from)
            setFrom((from) => from + 10)
        }
    }

    const getResult = (ev) => {
        if (ev.cancelled) return 'Cancelled'
        if (ev.fund) return ev.fund.won + ` (${ev.fund.percent * 100}%)`
        return ev.winner.nickName
    }

    if (error) return <Error />

    try {
        return (<>
            <div className="control-current control-history">
            <p className="list-count">Events log : <span>{history.length}</span></p>
                {history.length > 0 && <table >
                    <thead>
                        <tr>
                            <td>Creator</td>
                            <td>Game</td>
                            <td>Players</td>
                            <td>Date</td>
                            <td>Type</td>
                            <td>Winner/Winnings</td>
                        </tr>
                    </thead>
                    <tbody style={{ zIndex: '1001' }}>
                        {history.map((event, idx) => <tr key={idx}>
                            <td>{event.players[0].nickName}</td>
                            <td>{event.game}</td>
                            <td>{event.players.length}</td>
                            <td>{formatDateHour(event.date)}</td>
                            <td>{event.fund ? 'Fund event' : 'Vs event'}</td>
                            <td>{getResult(event)}</td>
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