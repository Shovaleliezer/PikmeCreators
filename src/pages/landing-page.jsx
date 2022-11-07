import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setFilter } from '../store/actions/general.actions'


export function LandingPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let isNarrow = window.innerWidth < 700 ? true : false

    const imgClick = (filter)=>{
        dispatch(setFilter({ search: filter }))
        navigate('/')
    }

    return (
        <>
            <section className="landing-upper">
                {! isNarrow && <div className='choose-wrapper'><img className="choose" src={require('../style/imgs/choose.png')} /></div>}
                <div className='images-container'>
                    <img src={require('../style/imgs/landing-sport.png')} onClick={()=>{imgClick('sport')}}/>
                    {isNarrow && <img className="choose" src={require('../style/imgs/choose.png')} />}
                    <img src={require('../style/imgs/landing-esports.png')} onClick={()=>{imgClick('esports')}}/>
                </div>
            </section>

            <section className="landing-lower">
                <h1>How it works</h1>
                <div className='roadmap-wrapper'>
                <img src={isNarrow? require('../style/imgs/landing-roadmap-mobile.png') : require('../style/imgs/landing-roadmap-desktop.png')} />
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