import { useSelector, useDispatch } from "react-redux"
import { setPopup } from "../store/actions/general.actions"
import { isMobile } from "react-device-detect"
import { setIsConnected } from '../store/reducers/userReducer'
import { WalletConnect } from '../cmps/wallet-connect'
import { Create } from "./create"
import { Edit } from "./edit"
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

    if (!popup) return <></>

    return (<>
        <div className="screen blur" onClick={() => { dispatch(setPopup('')) }}>
            {isMobile && <div onClick={() => dispatch(setPopup(''))} className="popup-close-mobile"><p>Tap to close</p></div>}
        </div>
        <section className={`popup ${mode.type}`}>
            {popup === 'connect' && <div>{ethereum ? <WalletConnect from='popup' /> :
                <div className="extension-wrapper"><ExtensionConnect mode={mode} /> <div className="done" onClick={() => dispatch(setPopup(''))}>Done</div></div>}</div>}

            {popup === 'connected' && <div className="wellcome">
                <h1>welcome back {user.nickName}</h1>
                <div className="done" onClick={() => dispatch(setPopup(''))}>Done</div>
            </div>}

            {popup === 'create' && <Create />}

            {popup === 'edit' && <Edit />}

            {popup.slice(0, 1) === '6' && <div className="event-link">
                <p>Event created successfully!</p>
                <p>To get it confirmed, please send your opponent the link below:</p>
                <h3>{'http://localhost:3000/#/confirm/' + popup}</h3>
                <div className="done" onClick={() => dispatch(setPopup(''))}>Done</div>
            </div>}

        </section>
    </>
    )
}