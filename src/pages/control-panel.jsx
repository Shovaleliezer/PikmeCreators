import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { adminService } from "../services/admin.service"
import { Error } from './error'
import { ControlWaiting } from "../cmps/control-waiting"
import { ControlCurrent } from "../cmps/control-current"
import { ControlPayment } from "../cmps/control-payment"
import { ControlHistory } from "../cmps/control-history"

export function ControlPanel() {
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState('loading')
    const [opt, setOpt] = useState('waiting list')
    const user = useSelector((state) => state.user)
    const options = ['waiting list', 'upcoming', 'payment', 'history']

    useEffect(() => {
        authorize()
        window.scrollTo(0, 0)
    }, [])

    const authorize = async () => {
        try {
            const admin = await adminService.authorize(user.creator._id)
            if (admin) setIsAdmin(true)
            else setIsAdmin(false)
        }

        catch {
            setIsAdmin(false)
        }
    }

    if (isAdmin === 'loading') return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div></div>

    if (!isAdmin) {
        navigate('/')
        return <h1>Unauthorized</h1>
    }

    try {
        return (
            <section className="control">
                <div className="control-banner"><h1>Wellcome {user.creator.nickName}</h1></div>
                <div className="options-bar">
                    {options.map(op => <p className={op === opt ? 'chosen' : ''} key={op} onClick={() => setOpt(op)}>{op.charAt(0).toUpperCase() + op.slice(1)}</p>)}
                </div>
                {opt === 'waiting list' && <ControlWaiting />}
                {opt === 'upcoming' && <ControlCurrent />}
                {opt === 'payment' && <ControlPayment />}
                {opt === 'history' && <ControlHistory />}
            </section>)
    }
    catch {
        return <Error />
    }
}