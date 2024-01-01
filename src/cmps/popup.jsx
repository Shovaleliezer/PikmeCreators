import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { setPopup, setUpperPopup } from "../store/actions/general.actions"
import { isMobile } from "react-device-detect"
import { WalletConnect } from '../cmps/wallet-connect'
import { PopupStats } from "./popup-stats"
import { PopupVideo } from "./popup-video"
import { ExtensionConnect } from '../cmps/extention-connect'
import { getRoute } from "../services/utils"
import { EmailShareButton, WhatsappShareButton, TelegramShareButton, FacebookMessengerShareButton } from "react-share"

export function Popup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { popup } = useSelector((storeState) => storeState.generalModule)
    const { popupStats } = useSelector((storeState) => storeState.generalModule)
    const { ethereum } = window

    useEffect(() => {
        if (popup) document.body.classList.add("no-scroll")
        else document.body.classList.remove("no-scroll")
        return () => document.body.classList.remove("no-scroll")
    }, [popup])

    const copy = () => {
        navigator.clipboard.writeText(getRoute() + 'confirm/' + getPopupShareInfo('id'))
    }

    const getPopupShareInfo = (info) => {
        if (info === 'id') return popup.substring(0, popup.indexOf('/'))
        if (info === 'name') return popup.substring(popup.indexOf('/') + 1, popup.indexOf('*'))
        return popup.substring(popup.indexOf('*') + 1)
    }

    if (!popup) return <></>

    if (popup.charAt(0) === '/') return <>
        <div className="screen blur" onClick={() => { dispatch(setPopup('')) }}>
            {isMobile && <div onClick={() => dispatch(setPopup(''))} className="popup-close-mobile"><p>Tap to close</p></div>}
        </div>
        <div className="confirm-exit">
            <img src={require(`../style/imgs/stream/pause.png`)} />
            <h1>Confirm navigation</h1>
            <p>If you are already live, this action will pause your stream, continue anyway?</p>
            <div>
                <div onClick={() => dispatch(setPopup(''))}>Cancel</div>
                <div className="action" onClick={() => { dispatch(setPopup('')); navigate(popup) }}>Continue</div>
            </div>
        </div></>

    return (<>
        <div className="screen blur" onClick={() => { dispatch(setPopup('')) }}>
            {isMobile && <div onClick={() => dispatch(setPopup(''))} className="popup-close-mobile"><p>Tap to close</p></div>}
        </div>
        <section className='popup' style={{ zIndex: '100' }}>

            {popup === 'connect' && <div>{ethereum ? <WalletConnect from='popup' /> :
                <div className="extension-wrapper"><ExtensionConnect /> <div className="done" onClick={() => dispatch(setPopup(''))}>Done</div></div>}</div>}

            {popup === 'stats' && <PopupStats stats={popupStats} />}

            {popup === 'upload-event' && <div>
                <p style={{ textAlign: 'center' }}>Uploading your event, this may take up to a minute...</p>
                <div className="loader loader-block" style={{ marginTop: '30px', marginBottom: '30px' }}><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div></div>
            </div>}

            {popup.slice(0, 1) === '6' && <div className="event-link">
                <p>Event created successfully!</p>
                <p>To get it confirmed, please send your opponent the link below:</p>
                <div className="share-wrapper">
                    <div className="copy"><span>{getRoute() + 'confirm/' + getPopupShareInfo('id')}</span>
                        <img onClick={() => { copy(); dispatch(setUpperPopup('copied')) }} src={require('../style/imgs/register/address.png')} /></div>
                    <div className="buttons">
                        <EmailShareButton className="share-button email"
                            url={getRoute() + 'confirm/' + getPopupShareInfo('id')}
                            subject={`challenge ${getPopupShareInfo('name')}'s in his ${getPopupShareInfo('game')} competition!`} />
                        <WhatsappShareButton className="share-button whatsapp"
                            title={`Click this link to challenge ${getPopupShareInfo('name')}'s in his ${getPopupShareInfo('game')} competition!`}
                            url={getRoute() + 'confirm/' + getPopupShareInfo('id')} />
                        <FacebookMessengerShareButton className="share-button facebook" url={getRoute() + 'confirm/' + popup} />
                        <TelegramShareButton className="share-button telegram"
                            title={`Click this link to challenge ${getPopupShareInfo('name')}'s in his ${getPopupShareInfo('game')} competition!`}
                            url={getRoute() + 'confirm/' + getPopupShareInfo('id')} />
                    </div>
                </div>
                <div className="done" onClick={() => { dispatch(setPopup('')); navigate('/') }}>Done</div>
            </div>}

            {popup === 'created' && <div className="created">
                <img src={require('../style/imgs/share/vi.png')} />
                <h1>Event in progress</h1>
                <p>The event was successfully created and is now awaiting approval. You can edit your event until the event is approved.</p>
                <div className="done" onClick={() => { dispatch(setPopup('')); navigate('/') }}>Done</div>
            </div>}

            {popup.includes('cloudinary') && <PopupVideo video={popup} />}

        </section>
    </>
    )
}