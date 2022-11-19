import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { userService } from "../services/userService"
import { WalletConnect } from "../cmps/wallet-connect"
import { Register } from "../cmps/register"
import { setIsConnected } from "../store/reducers/userReducer"
import { ExtensionConnect } from "../cmps/extention-connect"

export function Home() {
    const dispatch = useDispatch()
    const [creator, setCreator] = useState(false)
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
        console.log(loadedCreator)
        if (loadedCreator) setCreator(loadedCreator)
    }

    if (!ethereum) return <ExtensionConnect />
    if (!isConnected) return <WalletConnect from='profile' handleCreatorAddress={handleCreatorAddress} />
    if (!creator) return <Register />

    return (<section className="creator-home">
        <section className="home">
            <div className="home-banner"><h1>Welcome back, {creator.nickName}</h1></div>
            { }
        </section>
    </section>)
}

function getEvents() {
    return [
        {
            category: 'sports',
            game: 'poker',
            opponent: 'idan',
            date: '11/2/23',
            status: 'waiting'
        },
        {
            category: 'sports',
            game: 'poker',
            opponent: 'idan',
            date: '11/5/23',
            status: 'approved'
        },
        {
            category: 'sports',
            game: 'poker',
            opponent: 'nave',
            date: '11/12/23',
            status: 'waiting'
        },
    ]
}