import { useState } from "react"
import { useDispatch } from "react-redux"
import { formatDate } from "../services/utils"
import { setUpperPopup } from "../store/actions/general.actions"
import { adminService } from '../services/admin.service'

export function PaymentCard({ ev, loadPayment }) {
    const dispatch = useDispatch()
    const [popup, setPopup] = useState(false)

    const copyWallets = () => {
        const wallets = ev.payments.wallets
        let walletsStr = '['
        wallets.forEach((address, idx) => {
            walletsStr += address
            if (idx !== wallets.length - 1) walletsStr += ', '
        })
        walletsStr += ']'
        navigator.clipboard.writeText(walletsStr)
        dispatch(setUpperPopup('copied-list'))
    }

    const copyPayments = () => {
        const payments = ev.payments.moneyWon
        let str = '['
        payments.forEach((address, idx) => {
            str += Number(address)
            if (idx !== payments.length - 1) str += ', '
        })
        str += ']'
        navigator.clipboard.writeText(str)
        dispatch(setUpperPopup('copied-list'))
    }

    const confirmPayment = async () => {
        try {
            await adminService.confirmPayment(ev._id)
            loadPayment()
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    return (<>
        <div className='current-card'>
            <div className="event-upper">
                <div className="name-wrapper">
                    <img src={ev.players[0].image} />
                    <h3>{ev.players[0].nickName}</h3>
                </div>
                <div className="options">
                    <img src={require('../style/imgs/payments/wallet.png')} onClick={copyWallets}/>
                    <img src={require('../style/imgs/payments/moneyWon.png')} onClick={copyPayments}/>
                    <img src={require('../style/imgs/payments/vi.png')} onClick={()=>setPopup(true)}/>
                </div>
            </div>
            <div className="event-inner">
                <img src={require(`../style/imgs/event-card/${ev.game}.png`)} />
                <div className="headers">
                    <p>Type: </p>
                    <p>Game</p>
                    <p>players: </p>
                    <p>Ended at:</p>
                    <p>{ev.fund ? 'Won:' : 'Winner:'}</p>
                </div>
                <div className="details">
                    <p>{ev.fund ? 'Fund event' : 'Vs event'}</p>
                    <p>{ev.game}</p>
                    <p>{ev.players.length}</p>
                    <p>{formatDate(ev.date)}</p>
                    <p>{ev.fund ? ev.cancelled ? 'Cancelled' : ev.fund.won : ev.winner.nickName}</p>
                </div>
            </div>
        </div>
        {popup && <>
            <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                <h1>Confirm payment</h1>
                <p>By clicking confirm, you approve that everyone who was destined to receive a payment receive it. this action can't be undone.</p>
                <div className='buttons-wrapper'>
                    <div className='lighter' onClick={() => setPopup(false)}>Close</div>
                    <div className='bolder' onClick={() => { confirmPayment(); setPopup(false) }}>confirm</div>
                </div>
            </div>
            <div className="screen blur" onClick={() => setPopup(false)} />
        </>}
    </>)
}