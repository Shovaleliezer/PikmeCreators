import { useState, useRef } from "react"
import { httpService } from '../services/http.service'

export function Dev({ setDevModal }) {
    const password = useRef()
    const [opt, setOpt] = useState('null')

    const action = async () => {
        if (opt === 'create') {
            try {
                const res = await httpService.post('handle-dev/create-and-confirm', {password:password.current.value})
                alert(res)
            }
            catch (err) {
                alert(err)
            }
        }
        if (opt === 'delete') {
            try {
                const res = await httpService.post('handle-dev/delete-all', password.current.value)
                alert(res)
            }
            catch (err) {
                alert(err)
            }
        }
    }

    if (process.env.NODE_ENV === 'production') return <></>

    return (<>
        <div className="screen blur" onClick={() => { setDevModal(false) }} />

        <section className='popup dev'>
            <button onClick={() => { setOpt('create') }}>Create Demo Event</button>
            <button onClick={() => { setOpt('delete') }}>delete</button>
            <input placeholder="password" ref={password} />
            <button onClick={action}>{opt}</button>
            <button onClick={() => { setDevModal(false) }}>close</button>
        </section>
    </>
    )
}