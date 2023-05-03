import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { userService } from "../services/user.service"
import { Error } from './error'
import { resetState } from "../store/reducers/userReducer"

export function ControlPanel() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [creator, setLocalCreator] = useState('loading')
    const [error, setError] = useState(false)
    const [opt, setOpt] = useState('waiting list')
    const user = useSelector((state) => state.user)
    const options = ['waiting list', 'current events', 'payment', 'history']

    useEffect(() => {
        loadCreator()
        window.scrollTo(0, 0)
    }, [])

    const loadCreator = async () => {
        if (user.address) {
            try {
                const loadedCreator = await userService.addCreator(user.address, null)
                setLocalCreator(loadedCreator)
            }

            catch {
                setError(true)
                dispatch(resetState())
                setLocalCreator(false)
            }
        }

        else {
            setLocalCreator(false)
            navigate('/')
        }
    }

    if (error) return <Error />
    // if(!user.creator.isAdmin) return <h1>Unauthorized</h1>

    try {
        return (
            <section className="control">
                <div className="control-banner"><h1>Wellcome {creator.nickName}</h1></div>
                <div className="options-bar">
                    {options.map(op => <p className={op===opt ? 'chosen' : ''} onClick={()=>setOpt(op)}>{ op }</p>)}
                </div>
            </section>)
    }
    catch {
        console.log('sdfsdf')
        return <Error />
    }
}