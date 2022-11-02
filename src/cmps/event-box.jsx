import Timer from "./timer"
import { getDateName, formatHour } from "../services/utils"
export function EventBox({ ev }) {
    console.log(ev)

    const getRatios = (redTickets, blueTickets) => {
        const all = redTickets + blueTickets
        const redPrecent = Math.floor((redTickets / all) * 100) + 1
        const bluePrecent = Math.floor((blueTickets / all) * 100)
        return { redPrecent, bluePrecent }
    }

    const ratios = getRatios(527, 931)
    return (
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
                <div className="team-1-holder clickable">
                    <div>
                        <img className="team-icon" src={ev.teamOneIcon} />
                        <p>{ev.teamOneName}</p>
                    </div>
                    <h2>2.67</h2>

                </div>
                <img src={require('../style/imgs/choose.png')} className='choose' />
                <div className="team-2-holder clickable">
                    <h2>2.67</h2>
                    <div>
                        <p>{ev.teamTwoName}</p>
                        <img className="team-icon" src={ev.teamTwoIcon} />
                    </div>
                </div>
            </section>

        </div>
    )
}