import { useState, useEffect } from "react"

export function StreamTimer() {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1)
        }, 1000);

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    const formattedSeconds = `${("0" + (Math.floor(seconds / 3600) % 24)).slice(-2)}:` +
        `${("0" + (Math.floor(seconds / 60) % 60)).slice(-2)}:` +
        `${("0" + (seconds % 60)).slice(-2)}`

    return <p className="stream-timer">{formattedSeconds}</p>
}



