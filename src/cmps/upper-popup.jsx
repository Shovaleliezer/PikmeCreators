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

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-']
    console.log('popup', upperPopup)
    if (!upperPopup) return <></>

    return (
        <section className='upper-popup'>
            {upperPopup === 'copied' && <p>Link Copied!</p>}
            {upperPopup === 'copied-address' && <p>Address Copied!</p>}
            {upperPopup === 'socialError' && <p>Link broken!</p>}
            {upperPopup === 'socialUnsupported' && <p>you may enter only tiktok,instagram,twitter or youtube links</p>}
            {upperPopup === 'errorCreate' && <p>something went wrong... could not create event.</p>}
            {numbers.some(num => num === upperPopup.charAt(0)) && <p>cannot start or end live stream now, event starts in {upperPopup}</p>}
        </section>
    )
}