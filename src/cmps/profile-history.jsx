import { makeCommas } from "../services/utils"
import { isMobile } from "react-device-detect"

export function ProfileHistory(props) {
    const { mode } = props
    const history = getDemo()
    return (
        <section className={`profile-history ${mode.type}`}>
            <table>
                <thead>
                    <tr>
                        <td>Event name</td>
                        <td>Tickets price</td>
                        <td>Tickets bought</td>
                        <td>Chosen team</td>
                        <td>Date</td>
                        <td>Resault</td>
                    </tr>
                </thead>
                <tbody>
                    {history.map(event =>
                        <tr key={event.eventName}>
                            <td title={event.eventName}>{event.eventName.length > 20 ? event.eventName.substring(0, 20) + '...' : event.eventName}</td>
                            <td>{makeCommas(event.quantity * event.price)}$</td>
                            <td><div className="ticket-holder"><p>{makeCommas(event.quantity)}</p><img src={require('../style/imgs/ticket-icon.png')}/></div></td>
                            <td>{event.team}</td>
                            <td>{event.date}</td>
                            <td style={{ color: event.totalIncome < 0 ? '#c30000' : '#04C300' }}>{event.totalIncome < 0 ? 'Lost' : 'Won'}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    )
}

function getDemo() {
    return [{
        eventName: "cosmin vs the big bad super troll",
        price: 5,
        quantity: 200,
        date: '11/11/2022  6:40',
        totalIncome: -2000,
        team: 'lala',
    }, {
        eventName: "cosmin vs mishu",
        price: 5,
        quantity: 340,
        date: '11/11/2022  6:40',
        totalIncome: 3400,
        team: 'lala',
    }, {
        eventName: "cosmin vs tralala",
        price: 5,
        quantity: 51,
        date: '11/11/2022  6:40',
        totalIncome: 510,
        team: 'lala',
    }, {
        eventName: "cosmin vs mashu",
        price: 5,
        quantity: 195,
        date: '11/11/2022  6:40',
        totalIncome: -1950,
        team: 'lala',
    }]
}