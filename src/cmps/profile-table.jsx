import { makeCommas, formatDate, formatHour } from "../services/utils"
import { NavLink } from "react-router-dom"

export function ProfileTable(props) {
    const { mode, events } = props
    return (
        <section className={`profile-history ${mode.type}`}>
            {events.length === 0 && <div className="center">
                <img className="no-history" src={require('../style/imgs/no-history.png')} />
                <p>No tickets to display yet, would you like to <NavLink className={`${props.mode.type} main-color`} to='/'>buy some?</NavLink></p>
            </div>}

            {events.length > 0 && <table>
                <thead>
                    <tr>
                        <td>Event name</td>
                        <td>Tickets price</td>
                        <td>Tickets bought</td>
                        <td>Chosen team</td>
                        <td>Date</td>
                        {props.isHistory && <td>Resault</td>}
                    </tr>
                </thead>
                <tbody>
                    {events.map(event =>
                        <tr key={event.eventName}>
                            <td title={event.eventName}>{event.eventName.length > 20 ? event.eventName.substring(0, 20) + '...' : event.eventName}</td>
                            <td>{makeCommas(event.quantity * event.price)}$</td>
                            <td><div className="ticket-holder"><p>{makeCommas(event.quantity)}</p><img src={require('../style/imgs/ticket-icon.png')} /></div></td>
                            <td>{event.chosenTeam}</td>
                            <td><p>{formatDate(event.date)}</p><p>{formatHour(event.date)}</p></td>
                            {props.isHistory && <td style={{ color: event.totalIncome < 0 ? '#c30000' : '#04C300' }}>{event.totalIncome < 0 ? 'Lost' : 'Won'}</td>}
                        </tr>
                    )}
                </tbody>
            </table>}
        </section>
    )
}