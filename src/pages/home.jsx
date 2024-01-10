import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { userService } from "../services/user.service"
import { Register } from "../cmps/register"
import { EventCard } from "../cmps/event-card"
import { Error } from './error'
import { setAddress, setIsConnected, setPhone, setCreator, resetState } from "../store/reducers/userReducer"
import { setCallbackLink, setUpperPopup } from "../store/actions/general.actions"
import { setHomePhase } from "../store/actions/tutorial.actions"
import { Login } from "../cmps/login"

export function Home() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [creator, setLocalCreator] = useState('loading')
    const [error, setError] = useState(false)
    const { isConnected } = useSelector((state) => state.user)
    const { homePhase } = useSelector((state) => state.tutorialModule)
    const { callbackLink } = useSelector((state) => state.generalModule)
    const user = useSelector((state) => state.user)

    useEffect(() => {
        loadCreator()
        window.scrollTo(0, 0)
    }, [])

    const loadCreator = async () => {
        if (user.address) {
            try {
                const loadedCreator = await userService.addCreator(user.address, null)
                setLocalCreator(loadedCreator)
                dispatch(setCreator(loadedCreator))
                if (loadedCreator?.banned) navigate('/ban')
            }

            catch {
                setError(true)
                dispatch(resetState())
                setLocalCreator(false)
            }
        }

        else {
            setLocalCreator(false)
        }
    }

    const handleCreatorPhone = async (phone, code) => {
        try {
            const loadedCreator = await userService.validateOTP(phone, code)
            if (loadedCreator === false) {
                dispatch(setIsConnected(true))
                dispatch(setPhone(phone))
                setLocalCreator(false)
            }
            else if (typeof loadedCreator === 'string') dispatch(setUpperPopup('errorCode'))
            else if (typeof loadedCreator === 'object' && loadedCreator.nickName) {
                dispatch(setIsConnected(true))
                dispatch(setCreator(loadedCreator))
                dispatch(setAddress(loadedCreator.walletAddress))
                dispatch(setPhone(phone))
                setLocalCreator(loadedCreator)
                if (callbackLink) {
                    navigate(callbackLink)
                    dispatch(setCallbackLink(''))
                }
            }
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    if (error) return <Error />
    if (!isConnected) return <Login handleCreatorPhone={handleCreatorPhone} />
    if (creator === 'loading') return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div></div>
    if (!creator) return <Register />
    if (creator.creatorEvents && Object.keys(creator.creatorEvents).length > 0 && homePhase === 0) dispatch(setHomePhase(1))

    try {
        return (
            <section className="home">
                <div className="home-banner"><h1>Welcome {creator.nickName}</h1></div>
                {Object.keys(creator.creatorEvents).length > 0 ? <div className="events-container">
                    {Object.keys(creator.creatorEvents).map(ev => <EventCard key={creator.creatorEvents[ev]._id} ev={creator.creatorEvents[ev]} creator={creator} />)}
                </div>
                    : <div className="no-events">
                        <h1>You don't have any events yet, you can create one right <span onClick={() => navigate('/create')} className="clickable main-color">here</span>.</h1>
                        <img src={require('../style/imgs/no-events.png')} />
                    </div>}
            </section>)
    }
    catch {
        return <Error />
    }
}