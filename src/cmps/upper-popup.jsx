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
        setTimeout(() => { dispatch(setUpperPopup('')) }, 3000)
    }

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-']
    if (!upperPopup) return <></>

    return (
        <section className='upper-popup'>
            {upperPopup === 'errorServer' && <p>something went wrong... please try again later.</p>}
            {upperPopup === 'errorCode' && <p>Code is incorrect, please enter a valid one.</p>}
            {upperPopup === 'copied' && <p>Link Copied!</p>}
            {upperPopup === 'copied-address' && <p>Address Copied!</p>}
            {upperPopup === 'socialError' && <p>Link broken!</p>}
            {upperPopup === 'socialUnsupported' && <p>you may enter only tiktok,instagram,twitter or youtube links</p>}
            {upperPopup === 'errorCreate' && <p>something went wrong... could not create event.</p>}
            {upperPopup === 'errorDelete' && <p>something went wrong... could not delete event.</p>}
            {upperPopup==='choose' && <p>Please complete all the fields</p>}
            {upperPopup==='invalidPhone' && <p>invalid phone number, make sure the phone you entered is correct.</p>}
            {upperPopup==='invalidAddress' && <p>invalid address, make sure you use a valid ethereum wallet.</p>}
            {upperPopup==='takenAddress' && <p>This address is already used by other user.</p>}
            {upperPopup==='otherStream' && <p>Someone else already started streaming.</p>}
            {numbers.some(num => num === upperPopup.charAt(0)) && <p>cannot start or end live stream now, event starts in {upperPopup}</p>}
        </section>
    )
}