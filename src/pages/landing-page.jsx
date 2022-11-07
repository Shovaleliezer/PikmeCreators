export function LandingPage() {

    return (
        <>
            <section className="landing-upper">
                <div className='choose-wrapper'><img className="choose" src={require('../style/imgs/choose.png')} /></div>
                <div className='images-container'>
                    <img src={require('../style/imgs/landing-sport.png')} />
                    <img src={require('../style/imgs/landing-esports.png')} />
                </div>


            </section>
            <section className="landing-lower">
                <h1>How it works</h1>
                <div className='roadmap-wrapper'>
                <img src={require('../style/imgs/landing-roadmap-desktop.png')} />
                </div>
                <div className='wallets-container'>
                <img src={require('../style/imgs/landing-walletconnect.png')} />
                <img src={require('../style/imgs/landing-binance.png')} />
                <img src={require('../style/imgs/landing-metamask.png')} />

                </div>


            </section>
        </>

    )
}