import { useState, useEffect } from "react"
import { adminService } from "../services/admin.service"
import { Error } from "../pages/error"
import { formatDateHour } from "../services/utils"

export function ControlHistory() {
    const [history, setHistory] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const events = await adminService.getHistory()
            setHistory(events)
        }
        catch {
            setError(true)
        }
    }

    if (error) return <Error />

    if (!history) return <div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>

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
                            <td>{event.fund ? event.fund.won : event.winner.nickName}</td>
                        </tr>)}
                    </tbody>
                </table>}
            </div>
        </>)
    }
    catch {
        return <Error />
    }
}