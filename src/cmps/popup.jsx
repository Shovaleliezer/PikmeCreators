import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setPopup } from "../store/actions/general.actions"
import { isMobile } from "react-device-detect"
import { userService } from "../services/userService"
import { setIsConnected, setNickName, setAbout, setAddress, setImage } from '../store/reducers/userReducer'
import { getDateName, formatHour, makeCommas, getSocialIcon } from "../services/utils"
import { WalletConnect } from '../cmps/wallet-connect'
import { ExtensionConnect } from '../cmps/extention-connect'

export function Popup({ mode }) {
    const dispatch = useDispatch()
    const { popup } = useSelector((storeState) => storeState.generalModule)
    const { popupInfo } = useSelector((storeState) => storeState.generalModule)
    const { popupBought } = useSelector((storeState) => storeState.generalModule)
    const user = useSelector((state) => state.user)
    const [player, setPlayer] = useState(null)
    const { ethereum } = window
    let isNarrow = window.innerWidth < 700 ? true : false

    useEffect(() => {
        if (popupInfo.player1) setPlayer(popupInfo.player1)
    }, [popupInfo.player1.nickName])

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

            {(popup === 'bought') && <div className="bought">
                <h1>successfully purchased!</h1>
                {!isNarrow ? <div className="inner-bought">
                    <img src={require('../style/imgs/valorant-purchase.png')} />
                    <div className="headers" style={{ justifyContent: 'flex-start' }}>
                        <p>Event: </p>
                        <p>Date:  </p>
                        <p>Tickets: </p>
                        <p>Prize pool:</p>
                    </div>
                    <div className="details" style={{ justifyContent: 'flex-start' }}>
                        <p>{popupBought.player1 + ' Vs ' + popupBought.player2}</p>
                        <p>{getDateName(popupBought.date)} , {formatHour(popupBought.date)} GMT</p>
                        <p>{makeCommas(popupBought.tickets)}</p>
                        <p> In case your team/player wins the prize pool is Divided among all viewers.
                            it may take up to 48 hours from the end of the game for you to see the income.</p>
                    </div>
                </div> :
                    <div className="inner-bought" >
                        <img src={require('../style/imgs/event-banner.png')} />
                        <div>
                            <h3>Event:</h3>
                            <p>{popupBought.player1 + ' Vs ' + popupBought.player2}</p>
                        </div>
                        <div>
                            <h3>Date</h3>
                            <p>{getDateName(popupBought.date)} , {formatHour(popupBought.date)} GMT</p>
                        </div>
                        <div>
                            <h3>Tickets:</h3>
                            <p>{makeCommas(popupBought.tickets)}</p>
                        </div>
                        <div>
                            <h3>Prize pool:</h3>
                            <p>In case your team/player wins the prize pool is Divided among all viewers.
                                it may take up to 48 hours from the end of the game for you to see the income.</p>
                        </div>

                    </div>}

                <div className="done" onClick={() => dispatch(setPopup(''))}>Done!</div>
            </div>}


            {(popup === 'info' && player) && <div className="bought">
                <div className="upper-navbar">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(() => setPlayer(popupInfo.player1))} style={{ visibility: player.nickName === popupInfo.player1.nickName ? 'hidden' : '' }}>
                        <circle cx="20" cy="20" r="20" transform="rotate(90 20 20)" fill="#F3F3F3" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M30 19.7504C30 19.4189 29.8683 19.101 29.6339 18.8666C29.3995 18.6322 29.0816 18.5005 28.7501 18.5005L14.2693 18.5005L19.6362 13.1361C19.7524 13.0199 19.8445 12.8819 19.9074 12.7301C19.9703 12.5783 20.0027 12.4156 20.0027 12.2512C20.0027 12.0869 19.9703 11.9241 19.9074 11.7723C19.8445 11.6205 19.7524 11.4825 19.6362 11.3663C19.52 11.2501 19.382 11.1579 19.2302 11.095C19.0783 11.0321 18.9156 10.9998 18.7513 10.9998C18.5869 10.9998 18.4242 11.0321 18.2724 11.095C18.1205 11.1579 17.9826 11.2501 17.8664 11.3663L10.3672 18.8655C10.2508 18.9816 10.1585 19.1195 10.0954 19.2713C10.0324 19.4232 10 19.586 10 19.7504C10 19.9148 10.0324 20.0776 10.0954 20.2294C10.1585 20.3813 10.2508 20.5192 10.3672 20.6353L17.8664 28.1344C18.101 28.3691 18.4194 28.501 18.7513 28.501C19.0832 28.501 19.4015 28.3691 19.6362 28.1344C19.8708 27.8997 20.0027 27.5814 20.0027 27.2495C20.0027 26.9176 19.8708 26.5993 19.6362 26.3646L14.2693 21.0002L28.7501 21.0002C29.0816 21.0002 29.3995 20.8686 29.6339 20.6342C29.8683 20.3998 30 20.0819 30 19.7504Z" fill="#182443" />
                    </svg>
                    <div>
                        <img src={player.image} />
                        <h1>{player.nickName}</h1>
                    </div>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(() => setPlayer(popupInfo.player2))} style={{ visibility: player.nickName === popupInfo.player2.nickName ? 'hidden' : '' }}>
                        <circle cx="20" cy="20" r="20" transform="rotate(-90 20 20)" fill="#F3F3F3" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M10 20.2496C10 20.5811 10.1317 20.899 10.3661 21.1334C10.6005 21.3678 10.9184 21.4995 11.2499 21.4995L25.7307 21.4995L20.3638 26.8639C20.2476 26.9801 20.1555 27.1181 20.0926 27.2699C20.0297 27.4217 19.9973 27.5844 19.9973 27.7488C19.9973 27.9131 20.0297 28.0759 20.0926 28.2277C20.1555 28.3795 20.2476 28.5175 20.3638 28.6337C20.48 28.7499 20.618 28.8421 20.7698 28.905C20.9217 28.9679 21.0844 29.0002 21.2487 29.0002C21.4131 29.0002 21.5758 28.9679 21.7276 28.905C21.8795 28.8421 22.0174 28.7499 22.1336 28.6337L29.6328 21.1345C29.7492 21.0184 29.8415 20.8805 29.9046 20.7287C29.9676 20.5768 30 20.414 30 20.2496C30 20.0852 29.9676 19.9224 29.9046 19.7706C29.8415 19.6187 29.7492 19.4808 29.6328 19.3647L22.1336 11.8656C21.899 11.6309 21.5806 11.499 21.2487 11.499C20.9168 11.499 20.5985 11.6309 20.3638 11.8656C20.1292 12.1003 19.9973 12.4186 19.9973 12.7505C19.9973 13.0824 20.1292 13.4007 20.3638 13.6354L25.7307 18.9998L11.2499 18.9998C10.9184 18.9998 10.6005 19.1314 10.3661 19.3658C10.1317 19.6002 10 19.9181 10 20.2496Z" fill="#182443" />
                    </svg>
                </div>
                {!isNarrow ? <div className="inner-bought">
                    <img src={require('../style/imgs/valorant-purchase.png')} />
                    <div className="player-details">
                        <p>Experience: <span>{new Date().getFullYear() - new Date(player.experience).getFullYear()} Years</span></p>
                        <p>Region: <span>{player.region}</span></p>
                        <p>Status: <span>{player.status}</span></p>
                        <p>Top achivement: <span>{player.topAchievement}</span></p>
                        <p>Proficiency game: <span>{player.proficiencyGame}</span></p>
                        <p>Find me at: <a href={player.socialLink} target="_blank"> <img src={require(`../style/imgs/contact/${getSocialIcon(player.socialLink)}.png`)} /></a></p>
                    </div>
                </div> :
                    <div className="inner-bought">
                        <img src={require('../style/imgs/event-banner.png')} />
                        <div>
                            <h3>Experience</h3>
                            <p>{new Date().getFullYear() - new Date(player.experience).getFullYear()} Years</p>
                        </div>
                        <div>
                            <h3>Region:</h3>
                            <p>{player.region}</p>
                        </div>
                        <div>
                            <h3>Status:</h3>
                            <p>{player.status}</p>
                        </div>
                        <div>
                            <h3>Top achivement:</h3>
                            <p>{player.topAchievement}</p>
                        </div>
                        <div>
                            <h3>Proficiency game:</h3>
                            <p>{player.proficiencyGame}</p>
                        </div>
                        <div>
                            <h3>Find me at:</h3>
                            <a href={player.socialLink} target="_blank"> <img className='contact-creator' src={require(`../style/imgs/contact/${getSocialIcon(player.socialLink)}.png`)} /></a>
                        </div>
                    </div>}
                <div className="done" onClick={() => dispatch(setPopup(''))}>Got it!</div>
            </div>}
        </section>
    </>
    )
}