import { useRef } from "react"
import { useNavigate } from "react-router"

export function Join() {
    const navigate = useNavigate()
    const linkRef = useRef()

    const linkConfirm = (e) => {
        e.preventDefault()
        window.location.replace(linkRef.current.value)
    }

    return (
        <div className='join'>
            <h1>join an event</h1>
            <p>Here you can enter the URL to join an existing event.</p>
            <form onSubmit={linkConfirm}>
                <input type='text' ref={linkRef}/>
                <button>Connect</button>
            </form>
            {window.innerWidth > 700 && <img src={require('../style/imgs/join/roadmap-desktop.png')} />}
            {window.innerWidth < 700 && <img src={require('../style/imgs/join/roadmap-mobile.png')} />}
        </div>
    )
}