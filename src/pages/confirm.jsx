import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { useParams } from "react-router"
import { eventService } from "../services/event.service"
import { formatDateHour, getRoute } from "../services/utils"
import { setUpperPopup, setCallbackLink } from "../store/actions/general.actions"
import { Error } from "./error"

export function Confirm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const [event, setEvent] = useState('loading')
    const [isSame, setIsSame] = useState(false)
    const user = useSelector((state) => state.user)

    useEffect(() => {
        loadEvent()
    }, [])

    const loadEvent = async () => {
        try {
            const loadedEvent = await eventService.getById(id)
            if (!user || !user.creator) {
                dispatch(setCallbackLink('confirm/' + loadedEvent._id))
                navigate('/')
                return
            }
            const isPlayer = loadedEvent.players.find(player => player.walletAddress === user.creator.walletAddress)
            if (isPlayer) setIsSame(true)
            setEvent(loadedEvent)
        }
        catch {
            navigate('/')
        }
    }

    const confirm = async () => {
        if (user && user.creator) {
            try {
                const ev = await eventService.confirm(user.creator._id, id)
                if (ev) navigate('/')
            }
            catch {
                dispatch(setUpperPopup('errorServer'))
            }
        }
        navigate('/')
    }

    const copy = () => {
        navigator.clipboard.writeText(getRoute() + 'confirm/' + event._id)
        dispatch(setUpperPopup('copied'))
    }

    if (event === 'loading') return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div></div>

    if (!event) return <div>oops! it seems there is no event on the link you recieved... </div>

    try {
        return (
            <div className='confirm'>
                <div className="boxes-wrapper">
                    <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='info-wrapper'>
                            <img src={require(`../style/imgs/register/${event.game}.webp`)} />
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
                {isSame ? <div className="same">
                    <p>You already take part in this event, please send this link to your opponents instead:</p>
                    <div className="copy"><span>{getRoute() + 'confirm/' + event._id.slice(0, 4) + '...sdfsdfsdfsdfsdfsdfsdff'}</span>
                        <img onClick={copy} src={require('../style/imgs/register/address.png')} /></div>
                </div> :
                    <div className="buttons">
                        <div className="reject" onClick={() => { navigate('/') }}>Reject</div>
                        <div className="accept" onClick={confirm}>Accept!</div>
                    </div>}
            </div>
        )
    }
    catch {
        return <Error />
    }
}