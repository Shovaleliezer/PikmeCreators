import { adminService } from "../services/admin.service"
import { useState, useEffect } from "react"
import { Error } from '../pages/error'
import { MyShowCard } from "./my-show-card"

export function ControlMyShows() {
    const [shows, setShows] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        loadShows()
    }, [])

    const loadShows = async () => {
        try {
            const loadedShows = await adminService.getMyShows()
            setShows(loadedShows)
        }
        catch {
            setError(true)
        }
    }

    const removeShowFromList = (id) => {
        setShows(shows.filter(show => show._id !== id))
    }

    if (error) return <Error />

    if (!shows) return <div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>

    try {
        return (<>
            <div className="control-current">
                <p className="list-count">awaiting shows : <span>{shows.length}</span></p>
                <div className="events-container">
                    {shows.map(show => <MyShowCard key={show._id} show={show} removeShowFromList={removeShowFromList} />)}
                </div>
            </div>
        </>)
    }
    catch (err) {
        console.log(err)
        return <Error />
    }
}