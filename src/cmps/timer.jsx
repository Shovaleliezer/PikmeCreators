import { useTimer } from 'react-timer-hook'
import { make2digits } from "../services/utils"

function MyTimer({ expiryTimestamp }) {
    const {
        seconds,
        minutes,
        hours,
        days,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') })

    return (
        <div className='timer'>
            <span>{make2digits(days)}</span>:<span>{make2digits(hours)}</span>:<span>{make2digits(minutes)}</span>:<span>{make2digits(seconds)}</span>
        </div>
    )
}

export default function Timer(props) {
    const time = props.eventDate
    time.setSeconds(time.getSeconds())
    return (
        <MyTimer expiryTimestamp={time} />
    )
}

