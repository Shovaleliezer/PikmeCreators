import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { userService } from "../services/userService"
import { WalletConnect } from "../cmps/wallet-connect"
import { Register } from "../cmps/register"
import { EventCard } from "../cmps/event-card"
import { Error } from './error'
import { setAddress, setIsConnected } from "../store/reducers/userReducer"
import { setCreator } from "../store/reducers/userReducer"
import { setCallbackLink, setPopup } from "../store/actions/general.actions"
import { ExtensionConnect } from "../cmps/extention-connect"
import { setHomePhase } from "../store/actions/tutorial.actions"

export function Home() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [creator, setLocalCreator] = useState('loading')
    const { ethereum } = window
    const { address, isConnected } = useSelector((state) => state.user)
    const { homePhase } = useSelector((state) => state.tutorialModule)
    const { callbackLink } = useSelector((state) => state.generalModule)

    useEffect(() => {
        if (address) {
            handleCreatorAddress(address)
        }
        // if (ethereum && ethereum.networkVersion !== '56') {
        //     dispatch(setPopup('network'))
        // }
    }, [address])

    const handleCreatorAddress = async (address) => {
        const isCreator = await userService.checkIsCreator(address)
        if (isCreator) {
            try {
                const loadedCreator = await userService.addCreator(address, null)
                setLocalCreator(loadedCreator)
                dispatch(setCreator(loadedCreator))
                dispatch(setIsConnected(true))
                dispatch(setAddress(loadedCreator.walletAddress))
                if (callbackLink) {
                    navigate(callbackLink)
                    dispatch(setCallbackLink(''))
                }
            }

            catch {
                setLocalCreator(false)
                console.log('could not load creator')
            }
        }
        else {
            setLocalCreator(false)
        }
    }

    if (!ethereum) return <ExtensionConnect />
    if (!isConnected) return <WalletConnect from='home' handleCreatorAddress={handleCreatorAddress} />
    if (creator === 'loading') return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div></div>
    if (!creator) return <Register />

    if (creator.creatorEvents && Object.keys(creator.creatorEvents).length > 0 && homePhase === 0) dispatch(setHomePhase(1))

    try {
        return (
            <section className="home">
                <div className="home-banner"><h1>Hello {creator.nickName}</h1></div>
                {Object.keys(creator.creatorEvents).length > 0 ? <div className="events-container">
                    {Object.keys(creator.creatorEvents).map(ev => <EventCard key={creator.creatorEvents[ev]._id}
                        ev={creator.creatorEvents[ev]} creator={creator} />)}
                </div>
                    : <div className="no-events">
                        <h1>You don't have any events yet, you can create one right <span onClick={() => { dispatch(setPopup('create')) }} className="clickable main-color">here</span>.</h1>
                        <img src={require('../style/imgs/no-events.png')} />
                    </div>}
            </section>)
    }
    catch {
        return <Error />
    }

}