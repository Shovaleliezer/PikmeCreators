import { useSelector } from "react-redux"
import { WalletConnect } from "../../cmps/wallet-connect"
import { ExtensionConnect } from "../../cmps/extention-connect"

export function CreatorHome(){
    const isConnected = useSelector((state) => state.user.isConnected)
    console.log(isConnected)
    if(!isConnected) return <WalletConnect from={'profile'}/>
    return <h1>fsdfsdgsdgdfsg</h1>
}