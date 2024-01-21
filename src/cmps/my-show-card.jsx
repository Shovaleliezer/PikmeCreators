import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { formatHour } from "../services/utils"
import { setUpperPopup, setStreamShow } from "../store/actions/general.actions"
import { adminService } from '../services/admin.service'

export function MyShowCard({ show, removeShowFromList }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loadShowForStream = async () => {
        try {
            const showForStream = await adminService.getGlobalShow(show._id)
            dispatch(setStreamShow(showForStream))
            navigate('/stream-control')
        }
        catch {
            dispatch(setUpperPopup('errorLoadEvent'))
        }
    }

    const formatDate = (date) => {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
        const d = new Date(date)
        return `${d.getDate()} ${monthNames[+date.slice(5, 7) - 1]} ${d.getFullYear()}, ${formatHour(date)}`
    }

    const getStatus = () => {
        if (show.status === 'cancelled') return <p style={{ color: 'red' }}>Cancelled</p>
        if (show.status === 'over') return <p style={{ color: 'red' }}>over</p>
        if (show.status === 'approved') return <p style={{ color: 'green' }}>Approved</p>
        return <p style={{ color: 'yellow' }}>Waiting...</p>
    }

    const deleteCreatorShow = async () => {
        try {
            await adminService.deleteCreatorShow(show._id)
            removeShowFromList(show._id)
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }
    try {
        return (<>
            <div className='current-card'>
                <div className="event-upper">
                    <div className="name-wrapper">
                        <img src={show.img} />
                        <h3>{show.performerName}</h3>
                    </div>
                    <div className="options">
                        {show.status === 'cancelled' || show.status === 'over' && <p onClick={() => deleteCreatorShow(show._id)}>Remove</p>}
                        {show.status === 'approved' && <p onClick={loadShowForStream}>Stream</p>}
                    </div>
                </div>
                <div className="event-inner">
                    <div className="headers">
                        <p>Title:</p>
                        <p>Date</p>
                        <p>Tickets:</p>
                        <p>Status:</p>
                    </div>
                    <div className="details">
                        <p>{show.title}</p>
                        <p>{formatDate(show.date)}</p>
                        <p>{34}</p>
                        {getStatus()}
                    </div>
                </div>
            </div>
        </>)
    }
    catch (err) {
        console.log(err)
        return <></>
    }

}