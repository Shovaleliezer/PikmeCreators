import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { userService } from "../../services/userService"
import { WalletConnect } from "../../cmps/wallet-connect"
import { CreatorRegister } from "../../cmps/creator/creator-register"
import { setIsConnected } from "../../store/reducers/userReducer"
import { ExtensionConnect } from "../../cmps/extention-connect"

export function CreatorHome() {
    const dispatch = useDispatch()
    const [isCreator, setIsCreator] = useState(false)
    const { ethereum } = window
    const isConnected = useSelector((state) => state.user.isConnected)
    const { address } = useSelector((state) => state.user)

    useEffect(() => {
        if(address) handleCreatorAddress(address)
    }, [])

    if (ethereum) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (!accounts[0]) {
                dispatch(setIsConnected(false))
            }
        })
    }

    const handleCreatorAddress = async (address) => {
        const loadedIsCreator = await userService.checkIsCreator(address)
        if (loadedIsCreator) setIsCreator(true)
    }

    if (!ethereum) return <ExtensionConnect />
    if (!isConnected) return <WalletConnect from='profile' handleCreatorAddress={handleCreatorAddress} />
    if(!isCreator) return <CreatorRegister/>
    
    return (<section className="creator-home">
        
    </section>)
}