import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setStreamPopup } from "../store/actions/general.actions"

export function StreamPopup() {
    const dispatch = useDispatch()
    const { streamPopup } = useSelector((storeState) => storeState.generalModule)

    useEffect(() => {
        if (streamPopup) reset()
    }, [streamPopup])

    const reset = () => {
        setTimeout(() => { dispatch(setStreamPopup('')) }, 4000)
    }

    if(!streamPopup) return <></>
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-']
    return (
        <section className='stream-popup'>
            {numbers.some(num => num === streamPopup.charAt(0)) && <p>cannot start or end live stream now, event starts in {streamPopup}</p>}
        </section>
    )
}