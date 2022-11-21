import { useState, useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { useParams } from "react-router"
import { eventService } from "../services/event.service"
import { formatDateHour } from "../services/utils"
import { setPopup } from "../store/actions/general.actions"

export function Confirm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const [event, setEvent] = useState(null)
    const user = useSelector((state) => state.user)

    useEffect(() => {
        loadEvent()
    }, [])

    const loadEvent = async () => {
        const loadedEvent = await eventService.getById(id)
        setEvent(loadedEvent)
    }

    const confirm = async () => {
        if (user && user.creator) {
            const ev = await eventService.confirm(user.creator,id)
            if(ev) navigate('/')
            else console.log('error1')
        }
        navigate('/')
    }

    if (!event) return <div>oops! it seems there is no event on the link you recieved... </div>
    return (
        <div className='confirm'>
            <div className="boxes-wrapper">
                <div className='h3-wrapper'>
                    <h3>Game</h3>
                    <div className='info-wrapper'>
                        <img src={require(`../style/imgs/register/${event.game}.png`)} />
                        <p>{event.game}</p>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Date</h3>
                    <div className='info-wrapper'>
                        <p>{formatDateHour(event.date)}</p>
                    </div>
                </div>
            </div>
            <div className='desc-wrapper'>
                <h3>Description</h3>
                <div>{event.description}</div>
            </div>
            <div className='checkbox-wrapper'>
                <div className='checkbox'>
                    {event.shareWithCommunity && <span className="main-color noselect material-symbols-outlined">done</span>}
                </div>
                <p>Share with community</p>
            </div>
            <div className="buttons">
                <div className="reject">Reject</div>
                <div className="accept" onClick={confirm}>Accept!</div>
            </div>
        </div>
    )
}