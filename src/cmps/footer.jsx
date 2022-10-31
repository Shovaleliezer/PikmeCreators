import { useRef } from 'react'

export function Footer() {
    const mailRef = useRef()
    const onRegisterEmail = (e) => {
        e.preventDefault()
        console.log(mailRef.current.value)

    }

    return (
        <div className='footer-wrapper'>


            <section className="footer">

                <section className="email">
                    <h3>don't miss the show</h3>
                    <p>Join our mailing list to get reminders for your events, and nortificitions for new Events that you like.</p>
                    <form onSubmit={onRegisterEmail}>
                        <input type='text' ref={mailRef} placeholder='Enter your email' />
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
                        <p>my profile</p>
                        <p>stream history</p>
                        <p>upcoming events</p>
                    </div>
                    <div className='support'>
                        <h3>support</h3>
                        <p>learn</p>
                        <p>help</p>
                        <p>feedback</p>
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