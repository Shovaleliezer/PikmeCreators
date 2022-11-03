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
    const user = useSelector((state) => state.user)
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
                dispatch(setPopup('connected'))
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
        <div className="screen blur" onClick={() => { dispatch(setPopup('')) }}>
            {isMobile && <div onClick={() => dispatch(setPopup(''))} className="popup-close-mobile"><p>Tap to close</p></div>}
        </div>
        <section className={`popup ${mode.type}`}>
            {(!isMobile && popup !== 'connected') && <div onClick={() => dispatch(setPopup(''))} className={`popup-close ${mode.type} clickable`}><span className="material-symbols-outlined">cancel</span></div>}
            {popup === 'connect' && <div>{ethereum ? <WalletConnect connectWallet={connectWallet} from='popup' /> : <ExtensionConnect mode={mode} />}</div>}
            {popup === 'connected' && <div className="wellcome">
                <h1>welcome back {user.nickName}</h1>
                <div onClick={() => dispatch(setPopup(''))}>Done</div>
            </div>}
            {popup === 'bought' && <div className="wellcome">
                <h1>Tickets purchased successfully !</h1>
                <div onClick={() => dispatch(setPopup(''))}>Done</div>
            </div>}
        </section>
    </>
    )
}