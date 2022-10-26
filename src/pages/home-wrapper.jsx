import { Home } from "./home"
import { useState, useEffect } from "react"

export function HomeWrapper({ mode }) {
    const [item, setItem] = useState(0)
    const [eventsLength, setEventsLength] = useState()

    useEffect(() => {
        window.addEventListener("wheel", handleScrolling, { passive: false })
        window.addEventListener("wheel", preventScrolling, { passive: false })
    }, [])

    const preventScrolling = (e) => {
        e.preventDefault()
    }

    const handleScrolling = (e) => {
        // if (e.wheelDeltaY > 0) {
        //     if (item - 1 >= 0) setItem(item - 1)
        //     console.log('up')
        // }
        // else {
        //     if (item + 1 < eventsLength)  setItem(item + 1)
        //     console.log('down')
        // }
        console.log('wrapper',item)
        setItem(item + 1)
        window.removeEventListener("wheel", handleScrolling)
        debounce()
    }

    const arrowClick = (val) => {
        if (item + val >= eventsLength || item + val < 0) return
        setItem(item + val)
    }

    const debounce = () => {
        setTimeout(() => window.addEventListener("wheel", handleScrolling, { passive: false }), 500)
    }

    return <Home mode={mode} handleScrolling={handleScrolling} preventDefault={preventScrolling} arrowClick={arrowClick} item={item} setEventsLength={setEventsLength} />
}