import { useState, useEffect } from "react"

export function StreamTimer({status}) {
    const [seconds, setSeconds] = useState(0)
    let intervalId = null

    useEffect(() => {
        clearInterval(intervalId)
        if (status === 'live') resume()
        else pause()
        return () => clearInterval(intervalId)
    }, [status])

    const pause = () => {
        clearInterval(intervalId)
    }

    const resume = () => {
        intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1)
        }, 1000);
    }

    const formattedSeconds = `${("0" + (Math.floor(seconds / 3600) % 24)).slice(-2)}:` +
        `${("0" + (Math.floor(seconds / 60) % 60)).slice(-2)}:` +
        `${("0" + (seconds % 60)).slice(-2)}`
    if (status !== 'live') return <></>
    return <p className="stream-timer">{formattedSeconds}</p>
}



