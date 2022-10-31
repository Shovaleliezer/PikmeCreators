import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { SearchBar } from "./search-bar"
import { setFilter } from '../store/actions/general.actions'
import { toggleMenu } from "../store/actions/general.actions"
import { useNavigate } from "react-router-dom"

export function Header(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [headerMode, setHeaderMode] = useState('')
    const [isSearch, setIsSearch] = useState(false)

    const user = useSelector((state) => state.user)
    let isMobile = window.innerWidth < 930 ? true : false

    const resetFilter = () => {
        dispatch(setFilter(''))
    }

    const filterClick = (filter) => {
        dispatch(setFilter({ search: filter }))
        navigate('/')
    }

    return (
        <>
            {!isMobile && <nav className={`header ${props.mode.type} noselect`}>
                
                <NavLink onClick={resetFilter} className={`undecorate ${props.mode.type} hover-main`} to='/'><img className="logo" src={require('../style/imgs/logo.png')} /></NavLink>

                {isSearch ? <> <div className="screen" onClick={()=>{setIsSearch(false)}}></div> <SearchBar mode={props.mode} addX={true} setIsSearch={setIsSearch}/> </> :
                 
                <div className="search-placeholder">
                    <button className={props.mode.type} onClick={()=>setIsSearch(true)}><img  className="search-icon" src={require('../style/imgs/search-icon.png')}/></button></div>}
                  

                <div className="left-bar">
                    <img onClick={() => { filterClick('valorant') }} className="bar-logo valorant" src={require('../style/imgs/valorant-logo.png')} />
                    <img onClick={() => { filterClick('fifa') }} className="bar-logo fifa" src={require('../style/imgs/fifa-logo.png')} />
                    <img onClick={() => { filterClick('sport') }} className="bar-logo" src={require('../style/imgs/sport-logo.png')} />
                    <NavLink to="/register"><img title="watch stream" className="bar-logo stream" src={require(`../style/imgs/stream-icon-${props.mode.type}.png`)} /></NavLink>
                    <NavLink to='/profile'><img className='header-user-img' src={(user && user.image) ? user.image : require('../style/imgs/user-icon.png')} /></NavLink>
                    <span className="material-symbols-outlined menu-icon clickable hover-main" onClick={() => dispatch(toggleMenu())}>menu</span>
                </div>
            </nav>}

            {isMobile && <>
                <nav className={`header ${props.mode.type} noselect`}>
                    {headerMode === 'search' ? <div className="mobile-search-wrapper">
                        <span onClick={() => { setHeaderMode('') }} className="material-symbols-outlined">arrow_back_ios_new</span>
                        <SearchBar mode={props.mode} />
                    </div> : <>
                        <NavLink onClick={resetFilter} to='/'><img className="logo" src={require('../style/imgs/logo.png')} /></NavLink>
                        <div className="header-mobile-bar">
                            <span className="material-symbols-outlined search-icon" onClick={() => setHeaderMode('search')}>search</span>
                            <img onClick={() => { setHeaderMode('games-bar') }} className="games-menu" src={require('../style/imgs/games-menu.png')} />
                            <span className="material-symbols-outlined menu-icon clickable hover-main" onClick={() => dispatch(toggleMenu())}>menu</span>
                        </div>
                        {headerMode === 'games-bar' && <div className={'games-bar' + ' ' + props.mode.type}>
                            <img onClick={() => { filterClick('valorant') }} className="bar-logo" src={require('../style/imgs/valorant-logo.png')} />
                            <img onClick={() => { filterClick('fifa') }} className="bar-logo fifa" src={require('../style/imgs/fifa-logo.png')} />
                            <img onClick={() => { filterClick('sport') }} className="bar-logo" src={require('../style/imgs/sport-logo.png')} />
                            <span onClick={() => { setHeaderMode('') }} className="material-symbols-outlined">expand_less</span>
                        </div>}
                    </>}
                </nav>

                <nav className={`footer-mobile ${props.mode.type}`}>
                    <NavLink onClick={resetFilter} to='/'><img src={require(`../style/imgs/home-icon-${props.mode.type}.png`)} /></NavLink>
                    <NavLink onClick={resetFilter} to='/'><img src={require(`../style/imgs/stream-icon-${props.mode.type}.png`)} /></NavLink>
                    <NavLink to='/profile'><img className='user-img circle' src={(user && user.image) ? user.image : require('../style/imgs/user-icon.png')} /></NavLink>
                </nav></>}
        </>
    )
}