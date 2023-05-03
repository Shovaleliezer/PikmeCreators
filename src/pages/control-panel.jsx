import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { adminService } from "../services/admin.service"
import { Error } from './error'
import { ControlWaiting } from "../cmps/control-waiting"

export function ControlPanel() {
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState('loading')
    const [opt, setOpt] = useState('waiting list')
    const user = useSelector((state) => state.user)
    const options = ['waiting list', 'current events', 'payment', 'history']

    useEffect(() => {
        authorize()
        window.scrollTo(0, 0)
    }, [])

    const authorize = async () => {
            try {
                const admin = await adminService.authorize(user.creator.phone)
                if(admin) setIsAdmin(true)
                else setIsAdmin(false)
            }

            catch {
                setIsAdmin(false)
            }
    }

    if (isAdmin === 'loading') return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div></div></div></div>

    if(!isAdmin){
        navigate('/')
        return <h1>Unauthorized</h1>
    } 

    try {
        return (
            <section className="control">
                <div className="control-banner"><h1>Wellcome {user.creator.nickName}</h1></div>
                <div className="options-bar">
                    {options.map(op => <p className={op === opt ? 'chosen' : ''} onClick={() => setOpt(op)}>{op}</p>)}
                </div>
                {opt === 'waiting list' && <ControlWaiting />}
            </section>)
    }
    catch {
        return <Error />
    }
}