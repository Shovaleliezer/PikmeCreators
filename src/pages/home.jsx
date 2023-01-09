import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { userService } from "../services/userService"
// import { WalletConnect } from "../cmps/wallet-connect"
// import { ExtensionConnect } from "../cmps/extention-connect"
import { Register } from "../cmps/register"
import { EventCard } from "../cmps/event-card"
import { Error } from './error'
import { setAddress, setIsConnected, setPhone,setCreator } from "../store/reducers/userReducer"
import { setCallbackLink, setPopup, setUpperPopup } from "../store/actions/general.actions"
import { setHomePhase } from "../store/actions/tutorial.actions"
import { Login } from "../cmps/login"

export function Home() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const [creator, setLocalCreator] = useState('loading')
    const { ethereum } = window
    const { address, isConnected } = useSelector((state) => state.user)
    const { homePhase } = useSelector((state) => state.tutorialModule)
    const { callbackLink } = useSelector((state) => state.generalModule)
    const {user} = useSelector((state) => state.user)
    let creator = user? user.creator : null
    let phone = user? user.phone : null

     useEffect(() => {
        if (phone) {
            // handleCreatorAddress(address)
        }
        window.scrollTo(0, 0)
    }, [phone])


    // useEffect(() => {
    //     if (address) {
    //         handleCreatorAddress(address)
    //     }
    //     window.scrollTo(0, 0)
    // }, [address])

    // const handleCreatorAddress = async (address) => {
    //     const isCreator = await userService.checkIsCreator(address)
    //     if (isCreator) {
    //         try {
    //             const loadedCreator = await userService.addCreator(address, null)
    //             setLocalCreator(loadedCreator)
    //             dispatch(setCreator(loadedCreator))
    //             dispatch(setIsConnected(true))
    //             dispatch(setAddress(loadedCreator.walletAddress))
    //             if (callbackLink) {
    //                 navigate(callbackLink)
    //                 dispatch(setCallbackLink(''))
    //             }
    //         }

    //         catch {
    //             setLocalCreator(false)
    //         }
    //     }
    //     else {
    //         setLocalCreator(false)
    //     }
    // }

    const handleCreatorPhone = async (phone, code) => {
        try {
            const creator = await userService.validateOTP(phone, code)
            if (creator === false) {
                dispatch(setCreator(false))
            }
            else if (typeof creator === 'string') {
                dispatch(setUpperPopup('errorCode'))
            }
            else if (typeof creator === 'object') {
                dispatch(setCreator(creator))
                dispatch(setIsConnected(true))
                dispatch(setAddress(creator.walletAddress))
                dispatch(setPhone(phone))
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

    // return <Register />
    // if (!ethereum) return <ExtensionConnect />
    // if (!isConnected) return <WalletConnect from='home' handleCreatorAddress={handleCreatorAddress} />
    if(!isConnected) return <Login handleCreatorPhone={handleCreatorPhone}/>
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