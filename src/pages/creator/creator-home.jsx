import { useSelector,useDispatch } from "react-redux"
import { WalletConnect } from "../../cmps/wallet-connect"
import { setIsConnected } from "../../store/reducers/userReducer"
import { ExtensionConnect } from "../../cmps/extention-connect"

export function CreatorHome() {
    const dispatch = useDispatch()
    const { ethereum } = window
    const isConnected = useSelector((state) => state.user.isConnected)

    if (ethereum) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (!accounts[0]) {
                dispatch(setIsConnected(false))
            }
        })
    }

    if (!ethereum) return <ExtensionConnect />
    if (!isConnected) return <WalletConnect from='profile'/>
    
    return <h1>fsdfsdgsdgdfsg</h1>
}