import { useState, useEffect } from 'react'
import { make2digits } from '../services/utils'

export function Timer(props) {
    useEffect(() => {
        return () => { clearTimeout(timeOut) }
    }, [])
    const [now, setNow] = useState(Date.now())
    const timeOut = setTimeout(() => {
        setNow(Date.now)
    }, 1000)

    const timestamp = props.eventDate.getTime() - now

    let days = Math.floor(timestamp / (1000 * 60 * 60 * 24))
    let hours = Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((timestamp % (1000 * 60)) / 1000)

    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        clearTimeout(timeOut)
        if(props.setShowTimer) props.setShowTimer(false)
        return <></>
    }

    return (
        <div className='timer'>
            {days > 0 && <span>{make2digits(days)}:</span>}
            {(hours > 0 || days > 0) && <span>{make2digits(hours)}:</span>}
            <span>{make2digits(minutes)}</span>:
            <span>{make2digits(seconds)}</span>
        </div>
    )
}



