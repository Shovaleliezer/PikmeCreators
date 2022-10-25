import { useSelector, useDispatch } from "react-redux"
import { setPopup } from "../store/actions/general.actions"
import { isMobile } from "react-device-detect"
import { userService } from "../services/userService"
import { setIsConnected, setNickName, setAbout, setAddress, setImage } from '../store/reducers/userReducer'
import { WalletConnect } from '../cmps/wallet-connect'
import { ExtensionConnect } from '../cmps/extention-connect'

export function Popup({ mode }) {
    const dispatch = useDispatch()
    const { popup } = useSelector((storeState) => storeState.generalModule)
    const { ethereum } = window

    if (ethereum) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (!accounts[0]) {
                dispatch(setIsConnected(false))
            }
        })
    }

    const connectWallet = async () => {
        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })
            const res = await userService.handleAccount(accounts[0])
            if (res) {
                dispatch(setAbout(res.about))
                dispatch(setAddress(res.walletAddress))
                dispatch(setNickName(res.nickName))
                dispatch(setIsConnected(true))
                dispatch(setImage(res.image))
            }
            else {
                dispatch(setIsConnected(false))
            }
        } catch (error) {
            dispatch(setIsConnected(false))
        }
    }

    if (!popup) return <></>

    return (<>
        <div className="screen blur" onClick={() => { dispatch(setPopup('')) }}></div>
        <section className={`popup ${mode.type}`}>
            {popup === 'connect' && ethereum?  <WalletConnect connectWallet={connectWallet} from='popup'/> : <ExtensionConnect mode={mode} />}
            <div onClick={() => dispatch(setPopup(''))} className={`popup-close ${mode.type}`}><p>Tap to close</p></div>
        </section>
    </>
    )
}