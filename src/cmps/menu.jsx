import { useRef } from "react"
import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import emailjs from 'emailjs-com'
import { resetState } from "../store/reducers/userReducer"
import { setMenu } from "../store/actions/general.actions"

export function Menu(props) {
    const dispatch = useDispatch()
    const textRef = useRef()
    const boxRef = useRef()
    const nameRef = useRef()
    const mailRef = useRef()
    const { menu } = useSelector((storeState) => storeState.generalModule)
    const { menuSide } = useSelector((storeState) => storeState.generalModule)
    const user = useSelector((state) => state.user)
    const isMobile = window.innerWidth < 700

    const sendFeedback = async (ev) => {
        ev.preventDefault()
        emailjs.sendForm('service_6o4hbxh', 'template_wcfvzf6', ev.target, '72RBm-BgL2a--9Gky')
            .then(() => { dispatch(setMenu('sent')) }
                , (err) => {
                    console.log('FAILED...', err)
                })
    }

    const logOut = () => {
        try {
            dispatch(resetState())
        }
        catch {
            console.log('could not log out')
        }
    }

    if (menu === '') return <></>
    return (<>
        <div className="screen" onClick={() => dispatch(setMenu(''))}></div>
        <section className={`menu ${props.mode.type + ' ' + menuSide} noselect`}>

            {menu === 'normal' && <>
                <div className="hover-main" onClick={() => dispatch(setMenu('help'))}><span className="material-symbols-outlined">help</span> <div>Help</div></div>
                <div className="hover-main" onClick={() => dispatch(setMenu('feedback'))}><span className="material-symbols-outlined">add_comment</span> <div>Feedback</div></div>
                {user.isConnected ? <div onClick={() => { logOut(); dispatch(setMenu('')) }} className="hover-main"><NavLink to='/' className="main-color"><span className="material-symbols-outlined">logout</span> <div>Log out</div></NavLink></div> :
                    <div className="hover-main" onClick={() => { dispatch(setMenu('')) }}><NavLink className="main-color" to='/profile'><span className="material-symbols-outlined">login</span><div>Login</div></NavLink></div>}
                {isMobile && <div onClick={() => dispatch(setMenu(''))} className="close-mobile clickable"><span className="material-symbols-outlined">cancel</span></div>}
            </>}
            {menu === 'help' && <>
                <div className="close" onClick={() => dispatch(setMenu('normal'))}><span className="material-symbols-outlined">close</span></div>
                <div className='center-start'>
                    <p className="help-p">Help</p>
                    <div className={`help-opt hover-main`} onClick={()=>window.open('https://homeric-games.gitbook.io/cvc/metamask-full-guide', '_blank').focus()}><p>how to install metamask?</p><span className="material-symbols-outlined">chevron_right</span></div>
                    <div className={`help-opt hover-main`} onClick={()=>window.open('https://homeric-games.gitbook.io/cvc/add-funds-to-metamask', '_blank').focus()}><p>how to add money to the meta mask?</p><span className="material-symbols-outlined">chevron_right</span></div>
                    <div className={`help-opt hover-main`}><p>how to buy a ticket?</p><span className="material-symbols-outlined">chevron_right</span></div>
                    <div className={`help-opt hover-main`} onClick={()=>window.open('https://homeric-games.gitbook.io/cvc/i-bought-a-ticket-what-now', '_blank').focus()}><p>I bought a ticket what now?</p><span className="material-symbols-outlined">chevron_right</span></div>
                    <div className={`help-opt hover-main`} onClick={()=>window.open('https://homeric-games.gitbook.io/cvc/how-to-add-bnb-network-to-metamask', '_blank').focus()}><p>how to add my network to metamask?</p><span className="material-symbols-outlined">chevron_right</span></div>
                    <div className={`help-opt hover-main`} onClick={()=>window.open('https://homeric-games.gitbook.io/cvc/metamask-full-guide', '_blank').focus()}><p>general help in the platform.</p><span className="material-symbols-outlined">chevron_right</span></div>
                </div>
            </>}
            {menu === 'feedback' && <>
                <div className="close" onClick={() => dispatch(setMenu('normal'))}><span className="material-symbols-outlined">close</span></div>
                <form className="center-start" onSubmit={sendFeedback}>
                    <p>Feedback</p>
                    <textarea name={'message'} rows="5" cols="25" className={props.mode.type} ref={textRef} autoFocus required placeholder="Please tell us how can we improve our product..."></textarea>
                    <input name={'user_name'} type='text' ref={nameRef} className={`txt ${props.mode.type}`} placeholder='Your name' required />
                    <input name={'user_email'} type='email' ref={mailRef} className={`txt ${props.mode.type}`} placeholder='Your email' required />
                    <div><input type="checkbox" id="notify" required ref={boxRef} />
                        <label htmlFor="notify"> Allow support to contact back</label></div>
                    <button className={`${props.mode.type} border-${props.mode.type}`}>Send</button>
                </form>
            </>}
            {menu === 'sent' && <>
                <div className="close" onClick={() => dispatch(setMenu('normal'))}><span className="material-symbols-outlined">close</span></div>
                <p>We got you, our support team are doing their best to improve.</p>
            </>}
        </section>
    </>)
}