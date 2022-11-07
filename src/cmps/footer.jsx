import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setMenu } from "../store/actions/general.actions"
import emailjs from 'emailjs-com'

export function Footer() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onRegisterEmail = (ev) => {
        ev.preventDefault()
        emailjs.sendForm('service_6o4hbxh', 'template_wcfvzf6', ev.target, '72RBm-BgL2a--9Gky')
            .then(() => { console.log('sent') }
                , (err) => {
                    console.log('FAILED...', err)
                })
    }

    return (
        <div className='footer-wrapper'>

            <section className="footer" id={footerId}>

                <section className="email">
                    <h3>don't miss the show</h3>
                    <p>Join our mailing list to get reminders for your events, and nortificitions for new Events that you like.</p>
                    <form onSubmit={onRegisterEmail}>
                        <input name={'user_email'} type='email' placeholder='Enter your email' />
                        <button>Sign Up</button>
                    </form>

                </section>

                <section className="contact">
                    <h3>join cryptoStream community</h3>
                    <div>
                        <img src={require('../style/imgs/contact/instagram.png')} />
                        <img src={require('../style/imgs/contact/twitter.png')} />
                        <img src={require('../style/imgs/contact/tiktok.png')} />
                    </div>

                </section>

                <section className="account">
                    <div className='my-account'>
                        <h3>my account</h3>
                        <p onClick={() => { navigate('/profile') }}>my profile</p>
                        <p onClick={() => { navigate('/profile') }}>stream history</p>
                        <p onClick={() => { navigate('/profile') }}>upcoming events</p>
                    </div>
                    <div className='support'>
                        <h3>support</h3>
                        <p>learn</p>
                        <p onClick={() => dispatch(setMenu('help'))}>help</p>
                        <p onClick={() => dispatch(setMenu('feedback'))}>feedback</p>
                    </div>
                </section>
            </section>

            <section className='footer-bottom'>
                <p>®2022 Homeric entertainment</p>
                <div>
                    <p>privacy policy</p>
                    <p>terms of service</p>
                </div>
            </section>
        </div>
    )
}