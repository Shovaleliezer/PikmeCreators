import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { userService } from "../services/userService"
import { WalletConnect } from "../cmps/wallet-connect"
import { Register } from "../cmps/register"
import { EventCard } from "../cmps/event-card"
import { setIsConnected } from "../store/reducers/userReducer"
import { setCreator } from "../store/reducers/userReducer"
import { setPopup } from "../store/actions/general.actions"
import { ExtensionConnect } from "../cmps/extention-connect"

export function Home() {
    const dispatch = useDispatch()
    const [creator, setLocalCreator] = useState(false)
    const { ethereum } = window
    const isConnected = useSelector((state) => state.user.isConnected)
    const { address } = useSelector((state) => state.user)

    useEffect(() => {
        if (address) handleCreatorAddress(address)
    }, [])

    if (ethereum) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (!accounts[0]) {
                dispatch(setIsConnected(false))
            }
        })
    }

    const handleCreatorAddress = async (address) => {
        const loadedCreator = await userService.addCreator(address, null)
        if (loadedCreator) {
            setLocalCreator(loadedCreator)
            console.log('home',loadedCreator)
            dispatch(setCreator(loadedCreator))
        }
    }

    const getOpponent = (event) => {
        if(event.team1.nickName === creator.nickName) return event.team2.nickName
        return event.team1.nickName
    }

    if (!ethereum) return <ExtensionConnect />
    if (!isConnected) return <WalletConnect from='profile' handleCreatorAddress={handleCreatorAddress} />
    if (!creator) return <Register />

    return (<section className="creator-home">
        <section className="home">
            <div className="home-banner"><h1>Welcome back, {creator.nickName}</h1></div>
            {Object.keys(creator.creatorEvents).length > 0 ? <div className="events-container">
                {Object.keys(creator.creatorEvents).map(ev => <EventCard getOpponent={getOpponent} key={creator.creatorEvents[ev]._id} ev={creator.creatorEvents[ev]} />)}
            </div>
                : <div className="no-events">
                    <h1>You don't have any events yet, you can create one right <span onClick={() => { dispatch(setPopup('create')) }} className="clickable main-color">here</span>.</h1>
                    <img src={require('../style/imgs/no-events.png')} />
                </div>}
        </section>
    </section>)
}