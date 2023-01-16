import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setPopup,setUpperPopup } from "../store/actions/general.actions"
import { isMobile } from "react-device-detect"
import { WalletConnect } from '../cmps/wallet-connect'
import { Create } from "./create"
import { Edit } from "./edit"
import { ExtensionConnect } from '../cmps/extention-connect'
import { getRoute } from "../services/utils"
import { EmailShareButton, WhatsappShareButton, TelegramShareButton, FacebookMessengerShareButton } from "react-share"

export function Popup({ mode }) {
    const dispatch = useDispatch()
    const { popup } = useSelector((storeState) => storeState.generalModule)
    const { ethereum } = window
    const { createPhase } = useSelector((state) => state.tutorialModule)

    useEffect(() => {
        if (popup) document.body.classList.add("no-scroll")
        else document.body.classList.remove("no-scroll")
        return () => document.body.classList.remove("no-scroll")
    }, [popup])

    const copy = () => {
        navigator.clipboard.writeText(getRoute() + 'confirm/' + popup)
    }

    if (!popup) return <></>

    return (<>
        <div className="screen blur" onClick={() => { dispatch(setPopup('')) }}>
            {isMobile && <div onClick={() => dispatch(setPopup(''))} className="popup-close-mobile"><p>Tap to close</p></div>}
        </div>
        <section className={`popup ${mode.type}`} style={{ zIndex: createPhase === 1 ? '1001' : '100' }}>

            {popup === 'connect' && <div>{ethereum ? <WalletConnect from='popup' /> :
                <div className="extension-wrapper"><ExtensionConnect mode={mode} /> <div className="done" onClick={() => dispatch(setPopup(''))}>Done</div></div>}</div>}

            {popup === 'create' && <Create />}

            {popup === 'edit' && <Edit />}

            {popup.slice(0, 1) === '6' && <div className="event-link">
                <p>Event created successfully!</p>
                <p>To get it confirmed, please send your opponent the link below:</p>
                <div className="share-wrapper">
                    <div className="copy"><span>{getRoute() + 'confirm/' + popup}</span>
                        <img onClick={()=>{copy();dispatch(setUpperPopup('copied'))}} src={require('../style/imgs/register/address.png')} /></div>
                    <div className="buttons">
                        <EmailShareButton className="share-button email" url={getRoute() + 'confirm/' + popup} />
                        <WhatsappShareButton className="share-button whatsapp" url={getRoute() + 'confirm/' + popup} />
                        <FacebookMessengerShareButton className="share-button facebook" url={getRoute() + 'confirm/' + popup} />
                        <TelegramShareButton className="share-button telegram" url={getRoute() + 'confirm/' + popup} />
                    </div>
                </div>
                <div className="done" onClick={() => { dispatch(setPopup('')); window.location.reload() }}>Done</div>
            </div>}

        </section>
    </>
    )
}