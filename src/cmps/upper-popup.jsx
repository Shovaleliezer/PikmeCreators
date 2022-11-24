import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUpperPopup } from "../store/actions/general.actions"

export function UpperPopup() {
    const dispatch = useDispatch()
    const { upperPopup } = useSelector((storeState) => storeState.generalModule)

    useEffect(() => {
        if (upperPopup) reset()
    }, [upperPopup])

    const reset = () => {
        setTimeout(() => { dispatch(setUpperPopup('')) }, 2000)
    }

    if(!upperPopup) return <></>

    return (
        <section className='upper-popup'>

            {upperPopup === 'copied' && <p>Copied!</p>}

        </section>
    )
}