import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation } from "react-router-dom"
import { toggleMenu, setMenuSide, setPopup } from "../store/actions/general.actions"

export function Header(props) {
    const dispatch = useDispatch()
    const location = useLocation()
    const user = useSelector((state) => state.user)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { registerPhase } = useSelector((state) => state.tutorialModule)
    let isMobile = window.innerWidth < 930 ? true : false

    return (
        <>
            {!isMobile && <div className="header noselect" style={{ zIndex: registerPhase === 2 ? '1001' : '100' }}>
                <div className="options-bar">
                    <span className="material-symbols-outlined menu-icon clickable hover-main" onClick={() => { dispatch(setMenuSide('left')); dispatch(toggleMenu()) }}>menu</span>
                    <NavLink to='/profile'>
                        {(user.creator) ? <img className='header-user-img' src={user.creator.image} /> :
                            <svg width="30" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="clickable hover-main-svg">
                                <g clipPath="url(#clip0_424_10288)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M27.9136 14.5457C27.9136 16.4745 27.1474 18.3244 25.7835 19.6883C24.4196 21.0522 22.5697 21.8184 20.6409 21.8184C18.712 21.8184 16.8622 21.0522 15.4983 19.6883C14.1344 18.3244 13.3681 16.4745 13.3681 14.5457C13.3681 12.6168 14.1344 10.767 15.4983 9.40308C16.8622 8.03918 18.712 7.27295 20.6409 7.27295C22.5697 7.27295 24.4196 8.03918 25.7835 9.40308C27.1474 10.767 27.9136 12.6168 27.9136 14.5457ZM24.2772 14.5457C24.2772 15.5101 23.8941 16.435 23.2122 17.117C22.5302 17.7989 21.6053 18.182 20.6409 18.182C19.6764 18.182 18.7515 17.7989 18.0696 17.117C17.3876 16.435 17.0045 15.5101 17.0045 14.5457C17.0045 13.5813 17.3876 12.6563 18.0696 11.9744C18.7515 11.2924 19.6764 10.9093 20.6409 10.9093C21.6053 10.9093 22.5302 11.2924 23.2122 11.9744C23.8941 12.6563 24.2772 13.5813 24.2772 14.5457Z" fill="white" fillOpacity="0.9" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.6409 0C9.59542 0 0.640869 8.95455 0.640869 20C0.640869 31.0455 9.59542 40 20.6409 40C31.6863 40 40.6409 31.0455 40.6409 20C40.6409 8.95455 31.6863 0 20.6409 0ZM4.27723 20C4.27723 23.8 5.5736 27.2982 7.74632 30.0764C9.2722 28.0725 11.2407 26.4486 13.498 25.3315C15.7554 24.2143 18.2404 23.6342 20.7591 23.6364C23.2451 23.634 25.6989 24.1991 27.9335 25.2887C30.168 26.3783 32.1244 27.9635 33.6536 29.9236C35.229 27.8575 36.2897 25.4458 36.748 22.8883C37.2062 20.3308 37.0489 17.701 36.289 15.2163C35.5292 12.7317 34.1885 10.4637 32.3781 8.60007C30.5677 6.73641 28.3395 5.33065 25.8779 4.49911C23.4163 3.66756 20.7921 3.43413 18.2224 3.81813C15.6527 4.20214 13.2114 5.19253 11.1004 6.70737C8.9895 8.22221 7.26962 10.2179 6.0831 12.5294C4.89659 14.8409 4.27756 17.4018 4.27723 20ZM20.6409 36.3636C16.8844 36.3693 13.2414 35.077 10.3281 32.7055C11.5007 31.0268 13.0615 29.6562 14.8776 28.7103C16.6937 27.7645 18.7114 27.2713 20.7591 27.2727C22.7812 27.2711 24.7745 27.752 26.5735 28.6753C28.3724 29.5987 29.9252 30.9379 31.1027 32.5818C28.1669 35.0304 24.4637 36.369 20.6409 36.3636Z" fill="white" fillOpacity="0.9" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_424_10288">
                                        <rect width="40" height="40" fill="white" transform="translate(0.640869)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        }
                    </NavLink>
                </div>
                <NavLink to='/'><img className="logo" src={require('../style/imgs/logo.png')} /></NavLink>
                <div className="options-bar" style={{ visibility: (user.creator) ? 'visible' : 'hidden' }}>
                    <NavLink to='/join'><div className="join-button">Join</div></NavLink>
                    <div onClick={() => dispatch(setPopup('create'))} className="create">Create</div>
                </div>

            </div>}
            {(isMobile && !location.pathname.includes('stream-control')) && <>
                <div className="header" style={{ zIndex: registerPhase === 2 ? '1001' : '100' }}>
                    <span className="material-symbols-outlined menu-icon hidden">menu</span>
                    <NavLink to='/'><img className="logo" src={require('../style/imgs/logo.png')} /></NavLink>
                    <span className="material-symbols-outlined menu-icon clickable hover-main" onClick={() => { dispatch(setMenuSide('left')); dispatch(toggleMenu()) }}>menu</span>
                </div>
                <nav className={`footer-mobile ${props.mode.type}`}>
                    <NavLink to='/profile'><img className='user-img circle' src={(user.creator) ? user.creator.image : require('../style/imgs/user-icon.png')} /></NavLink>
                    {(user && user.creator) && <img src={require('../style/imgs/create.png')} onClick={() => setIsMenuOpen(!isMenuOpen)} />}
                    <NavLink to='/'><img src={require(`../style/imgs/home-icon-${props.mode.type}.png`)} /></NavLink>
                    {isMenuOpen && <div className="create-menu">
                        <div onClick={() => { dispatch(setPopup('create')); setIsMenuOpen(false) }}>Create new event</div>
                        <NavLink to='/join'><div>Join event</div></NavLink>
                    </div>}
                </nav>
            </>}
        </>
    )
}