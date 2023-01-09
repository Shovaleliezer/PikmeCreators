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

    return (
        <section className='stream-popup'>
            {streamPopup === 'notStarted' && <p>cannot start or end live stream now, wait for the correct time</p>}
        </section>
    )
}