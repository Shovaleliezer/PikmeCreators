import { makeCommas } from "../services/utils"

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
                        <td>Date</td>
                        <td>Chosen team</td>
                        <td>Resault</td>
                    </tr>
                </thead>
                <tbody>
                    {history.map(event =>
                        <tr key={event.eventName}>
                            <td>{event.eventName}</td>
                            <td>{makeCommas(event.quantity*event.price)}$</td>
                            <td><div className="main-color ticket-holder"><p>{makeCommas(event.quantity)}</p><span className="material-symbols-outlined">local_activity</span></div></td>
                            <td className="main-color">{event.date}</td>
                            <td>{event.team}</td>
                            <td style={{ color: event.totalIncome < 0 ? '#c30000' : '#04C300' }}>{event.totalIncome<0? 'Lost' : 'Won'}</td>
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
        team:'lala',
    }, {
        eventName: "cosmin vs mishu",
        price: 5,
        quantity: 340,
        date: '11/11/2022  6:40',
        totalIncome: 3400,
        team:'lala',
    }, {
        eventName: "cosmin vs tralala",
        price: 5,
        quantity: 51,
        date: '11/11/2022  6:40',
        totalIncome: 510,
        team:'lala',
    }, {
        eventName: "cosmin vs mashu",
        price: 5,
        quantity: 195,
        date: '11/11/2022  6:40',
        totalIncome: -1950,
        team:'lala',
    }]
}