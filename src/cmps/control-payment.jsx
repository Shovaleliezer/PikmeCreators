import { adminService } from "../services/admin.service"
import { useState, useEffect } from "react"
import { Error } from '../pages/error'
import { PaymentCard } from "./payment-card"

export function ControlPayment() {
    const [payment, setPayment] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        loadPayment()
    }, [])

    const loadPayment = async () => {
        try {
            const events = await adminService.getPaymentEvents()
            setPayment(events)
        }
        catch {
            setError(true)
        }
    }

    if (error) return <Error />

    if (!payment) return <div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>
    try {
        return (<>
            <div className="control-current">
                <p className="list-count">awaiting payment : <span>{payment.length}</span></p>
                <div className="events-container">
                    {payment.map(ev => <PaymentCard key={ev._id} ev={ev} loadPayment={loadPayment} />)}
                </div>
            </div>
        </>)
    }
    catch {
        return <Error />
    }

}