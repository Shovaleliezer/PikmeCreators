import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setMenu } from "../store/actions/general.actions"
import emailjs from 'emailjs-com'

export function Footer() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const onRegisterEmail = (ev) => {
        ev.preventDefault()
        emailjs.sendForm('service_6o4hbxh', 'template_wcfvzf6', ev.target, '72RBm-BgL2a--9Gky')
            .then(() => { console.log('sent') }
                , (err) => {
                    console.log('FAILED...', err)
                })
    }
    if(location.pathname.includes('stream-control')) return <></>
        return (
            <div className='footer-wrapper'>
                <section className="footer">
    
                    <section className="email">
                        <h3>don't miss the show</h3>
                        <p>Join our mailing list to get reminders for your events, and notificitions for new Events that you like.</p>
                        <form onSubmit={onRegisterEmail}>
                            <input name={'user_email'} type='email' placeholder='Enter your email' />
                            <button>Sign Up</button>
                        </form>
    
                    </section>
    
                    <section className="contact">
                        <h3>join PIKME.TV community</h3>
                        <div>
                            <a href="https://www.instagram.com/pikme.tv/" target="_blank"><img src={require('../style/imgs/contact/instagram.png')} /></a>
                            <a href="https://twitter.com/PikmeTv" target="_blank"><img src={require('../style/imgs/contact/twitter.png')} /></a>
                            <a href="https://www.tiktok.com/@pikme.tv?lang=he-IL" target="_blank"><img src={require('../style/imgs/contact/tiktok.png')} /></a>
                        </div>
    
                    </section>
    
                    <section className="account">
                        <div className='my-account'>
                            <h3>my account</h3>
                            <p onClick={() =>  navigate('/profile') }>Profile</p>
                            <p onClick={() =>  navigate('/') }>my events</p>
                            <p onClick={() => navigate('/create')}>create event</p>
                        </div>
                        <div className='support'>
                            <h3>support</h3>
                            <p onClick={()=>window.open('https://homeric-games.gitbook.io/cvc/', '_blank').focus()}>learn</p>
                            <p onClick={() => dispatch(setMenu('help'))}>help</p>
                            <p onClick={() => dispatch(setMenu('feedback'))}>feedback</p>
                        </div>
                    </section>
                </section>
    
                <section className='footer-bottom'>
                <p onClick={()=>window.open('https://homericentertainment.com/', '_blank').focus()}>®2022 Homeric entertainment</p>
                    <div>
                        <p onClick={()=>window.open('https://www.privacypolicyonline.com/live.php?token=J4MpfGXa6se1Ak9047TKVsyJzqtXRHjD', '_blank').focus()}>privacy policy</p>
                        <p onClick={()=>window.open('https://www.privacypolicyonline.com/live.php?token=BSvr42ubTJcEKnEu7WdkM3qMJ7Dozlla', '_blank').focus()}>terms of service</p>
                    </div>
                </section>
            </div>
        )
    }
