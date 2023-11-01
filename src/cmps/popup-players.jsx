import { useState } from "react"
import { getSocialIcon } from "../services/utils"

export function PopupPlayers({ players, setPopup,event, accept,reject }) {
    const [idx, setIdx] = useState(0)
    let isNarrow = window.innerWidth < 700 ? true : false

    const handleChange = (ev) => {
        const { value } = ev.target
        setIdx(value)
    }

    return (<>
        <div className="screen blur" onClick={() => setPopup(false)}>
            {window.innerWidth < 700 && <div onClick={() => setPopup(false)} className="popup-close-mobile"><p>Tap to close</p></div>}
        </div>
        <section className='popup' style={{ zIndex: '1001' }}>
            <div className="bought noselect">
                <div className="upper-navbar center">
                <img src={require('../style/imgs/close-icon.png')} className='hidden'/>
                    <div className="center">
                        <img src={players[idx].image} />
                        <select onChange={handleChange} >
                            {players.map((player, index) => <option value={index}>{player.nickName}</option>)}
                        </select>
                    </div>
                    <img className="clickable" src={require('../style/imgs/close-icon.png')} onClick={() => { setPopup(false) }} />
                </div>
                {!isNarrow ? <div className="inner-bought">
                    <img src={require(`../style/imgs/popup/${players[idx].proficiencyGame}.webp`)} />

                    <div className="player-details">
                        <p>Experience: <span>{new Date().getFullYear() - players[idx].experience} Years</span></p>
                        <p>Region: <span>{players[idx].region}</span></p>
                        <p>Status: <span>{players[idx].status}</span></p>
                        <p>Top achivement: <span>{players[idx].topAchievement}</span></p>
                        <p>Proficiency game: <span>{players[idx].proficiencyGame}</span></p>
                        {players[idx].socialLink && <p>Find me at: <a href={players[idx].socialLink} target="_blank"> <img src={require(`../style/imgs/contact/${getSocialIcon(players[idx].socialLink)}.png`)} /></a></p>}
                    </div>
                </div> :
                    <div className="inner-bought">
                        <img src={require(`../style/imgs/popup/wide-${players[idx].proficiencyGame}.webp`)} />
                        <div className="mobile-line">
                            <h3>Experience:</h3>
                            <p>{new Date().getFullYear() - players[idx].experience} Years</p>
                        </div>
                        <div className="mobile-line">
                            <h3>Region:</h3>
                            <p>{players[idx].region}</p>
                        </div>
                        <div className="mobile-line">
                            <h3>Status:</h3>
                            <p>{players[idx].status}</p>
                        </div>
                        <div className="mobile-line">
                            <h3>Top achivement:</h3>
                            <p>{players[idx].topAchievement}</p>
                        </div>
                        <div className="mobile-line">
                            <h3>Proficiency game:</h3>
                            <p>{players[idx].proficiencyGame}</p>
                        </div>
                        {players[idx].socialLink && <div className="mobile-line">
                            <h3>Find me at:</h3>
                            <a href={players[idx].socialLink} target="_blank">
                                <img className='contact-creator' src={require(`../style/imgs/contact/${getSocialIcon(players[idx].socialLink)}.png`)} /></a>
                        </div>}
                    </div>}
                <div className='buttons-wrapper'>
                    <div className='lighter' onClick={() => reject(event._id)}>Reject</div>
                    <div className='bolder' onClick={() => accept(event)}>Accept</div>
                </div>
            </div>

        </section>
    </>)
}