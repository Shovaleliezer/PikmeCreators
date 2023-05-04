import { adminService } from "../services/admin.service"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Error } from '../pages/error'
import { setUpperPopup } from "../store/actions/general.actions"
import { CurrentCard } from "./current-card"

export function ControlCurrent() {
    const dispatch = useDispatch()
    const [current, setcurrent] = useState([])
    const [error, setError] = useState(false)
    const [popup, setPopup] = useState(false)

    useEffect(() => {
        loadCurrent()
    }, [])

    const loadCurrent = async () => {
        try {
            const current = await adminService.getCurrentEvents()
            setcurrent(current)
        }
        catch {
            setError(true)
        }
    }

    const endEvent = async (id) => {
        try {
            await adminService.announceWinner(id)
            await loadCurrent()
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const cancelEvent = async (id) => {
        try {
            await adminService.cancelEvent(id)
            await loadCurrent()
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    if (error) return <Error />

    return (<>
        <div className="control-current">
            <p className="list-count">Current events : <span>{current.length}</span></p>
            <div className="events-container">
                {current.map(ev => <CurrentCard key={ev._id} ev={ev} cancelEvent={cancelEvent} endEvent={endEvent}/>)}
                    
            </div>
        </div>

    </>)
}