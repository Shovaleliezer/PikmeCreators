import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUpperPopup } from "../store/actions/general.actions"
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-']

export function UpperPopup() {
    const dispatch = useDispatch()
    const { upperPopup } = useSelector((storeState) => storeState.generalModule)

    useEffect(() => {
        if (upperPopup) reset()
    }, [upperPopup])

    const reset = () => {
        setTimeout(() => { dispatch(setUpperPopup('')) }, 3000)
    }

    if (!upperPopup) return <></>

    return (
        <section className='upper-popup'>
            {upperPopup === 'errorServer' && <p>something went wrong... please try again later.</p>}
            {upperPopup === 'errorCode' && <p>Code is incorrect, please enter a valid one.</p>}
            {upperPopup === 'copied' && <p>Link Copied!</p>}
            {upperPopup === 'copied-list' && <p>List has been copied to clipboard!</p>}
            {upperPopup === 'copied-address' && <p>Address Copied!</p>}
            {upperPopup === 'socialError' && <p>Link broken!</p>}
            {upperPopup === 'socialUnsupported' && <p>you may enter only tiktok,instagram,twitter or youtube links</p>}
            {upperPopup === 'errorCreate' && <p>something went wrong... could not create event.</p>}
            {upperPopup === 'errorDelete' && <p>something went wrong... could not delete event.</p>}
            {upperPopup === 'noPlayers' && <p>Vs events need at least 2 players in order to be accepted</p>}
            {upperPopup === 'choose' && <p>Please complete all the fields</p>}
            {upperPopup === 'invalidPhone' && <p>invalid phone number, make sure the phone you entered is correct.</p>}
            {upperPopup === 'invalidAddress' && <p>invalid address, make sure you use a valid ethereum wallet.</p>}
            {upperPopup === 'desc' && <p>Use at least 20 characters for the description.</p>}
            {upperPopup === 'takenAddress' && <p>This address is already used by other user.</p>}
            {upperPopup === 'otherStream' && <p>Someone else already started streaming.</p>}
            {upperPopup === 'date' && <p>Cannot create event in the past, please enter a valid date in the future.</p>}
            {upperPopup === 'invalidPrize' && <p>Please enter a valid prize</p>}
            {upperPopup === 'errorLoadEvent' && <p>Cannot load event, please try again later</p>}
            {upperPopup === 'event-ended-error' && <p>Cannot start stream, the other creator might have ended it already</p>}
            {upperPopup === 'video-length' && <p>Video duration may not be longer than 1 minute.</p>}
            {upperPopup === 'edited' && <p>Event edited successfully!</p>}
            {upperPopup === 'min1' && <p>Minimum is 1BNB</p>}
            {upperPopup === 'max1m' && <p>Maximum is 1M BNB</p>}
            {upperPopup === 'video-size' && <p>500MB is the maximum video size.</p>}
            {upperPopup === 'imgRequired' && <p>Please upload an image of the event.</p>}
            {upperPopup.includes('banned-') && <p>{upperPopup.split('-').slice(1).join('-')} is now banned.</p>}
            {upperPopup.includes('banRemoved-') && <p>Ban removed for {upperPopup.split('-').slice(1).join('-')}</p>}
            {numbers.some(num => num === upperPopup.charAt(0)) && <p>cannot start or end live stream now, event starts in {upperPopup}</p>}
        </section>
    )
}