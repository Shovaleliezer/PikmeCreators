import Timer from "./timer"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setPopup } from "../store/actions/general.actions"
import { eventService } from "../services/eventService"
import { getDateName, formatHour, makeCommas } from "../services/utils"
export function EventBox({ ev }) {
    const [tickets, setTickets] = useState(1)
    const [chosen, setChosen] = useState('teamOne')
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const getRatios = (redTickets, blueTickets) => {
        const all = redTickets + blueTickets
        const redPrecent = Math.floor((redTickets / all) * 100) + 1
        const bluePrecent = Math.floor((blueTickets / all) * 100)
        const team1ratio = (all / redTickets).toString().slice(0, 4)
        const team2ratio = (all / blueTickets).toString().slice(0, 4)
        return { redPrecent, bluePrecent, team1ratio, team2ratio }
    }

    const onInputClick = (e) => {
        if (e.target.value >= 0 && e.target.value <= 9999) setTickets(Number(e.target.value))
    }
    const onButtonClick = (value) => {
        if (Number(tickets + value) >= 1 && Number(tickets + value) <= 9999) setTickets(Number(tickets + value))
    }
    const buyTickets = async () => {
        if (!user.isConnected) {
            dispatch(setPopup('connect'))
            return
        }
        if (tickets <= 0) return
        const eventt = await eventService.sellTickets(ev._id, { tickets, chosen, buyerAddress: user.address })
        if (eventt) dispatch(setPopup('bought'))
    }

    const ratios = getRatios(527, 931)
    return (
        <div>
            <div className='event-box' >
                <section className="event-details">
                    <img className="event-img" src={ev.teamOneIcon} />
                    <div className="timer-holder">
                        <p>Match Live in :</p>
                        <Timer eventDate={new Date(ev.date)} />
                    </div>
                    <div className="pricepool-holder">
                        <div>
                            <img className="coins" src={require('../style/imgs/coins.png')} />
                            <p>34K</p>
                        </div>
                        <div>
                            <img className="sand-watch" src={require('../style/imgs/sand-watch.png')} />
                            <div className="date-holder">
                                <p>{getDateName(ev.date)}</p>
                                <p>{formatHour(ev.date)} GMT</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="event-distribution">
                    <h2>Bet Distribution :</h2>
                    <div className="bar-wrapper">
                        <p>{ratios.redPrecent}%</p>
                        <div className="distribution-bar">
                            <div style={{ width: `${ratios.redPrecent}%` }} className="team-red"></div>
                            <div style={{ width: `${ratios.bluePrecent}%` }} className="team-blue"></div>
                        </div>
                        <p>{ratios.bluePrecent}%</p>
                    </div>
                </section>
                <section className="event-teams">
                    <div className={`team-1-holder clickable ${chosen === 'teamOne' ? 'border-main' : ''}`}
                        onClick={() => setChosen('teamOne')}
                        style={{ borderColor: chosen === 'teamOne' ? '$main' : '' }}>
                        <div>
                            <img className="team-icon" src={ev.teamOneIcon} />
                            <p>{ev.teamOneName}</p>
                        </div>
                        <h2>{ratios.team1ratio}</h2>

                    </div>
                    <img src={require('../style/imgs/choose.png')} className='choose' />

                    <div className={`team-2-holder clickable ${chosen === 'teamTwo' ? 'border-main' : ''}`}
                        onClick={() => setChosen('teamTwo')}>
                        <h2>{ratios.team2ratio}</h2>
                        <div>
                            <p>{ev.teamTwoName}</p>
                            <img className="team-icon" src={ev.teamTwoIcon} />
                        </div>
                    </div>
                </section>
            </div>
            <section className="buy-tickets">
                <div className="edit">
                    <div className="noselect" onClick={() => onButtonClick(-1)}>-</div>
                    <input type='number' value={tickets} step={1} onChange={onInputClick} />
                    <div className="noselect" onClick={() => onButtonClick(1)}>+</div>
                </div>
                <div className='pay' onClick={() => buyTickets()}>Buy tickets : {makeCommas(tickets * 5)}$</div>
            </section>
        </div>
    )
}