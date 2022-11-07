import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { eventService } from '../services/eventService'
import { setFilter, setPopup, setPopupInfo } from '../store/actions/general.actions'
import { EventBox } from '../cmps/event-box'

export function Home({ mode }) {
    const dispatch = useDispatch()
    const [events, setEvents] = useState([])
    const item = useRef(0)
    const eventLen = useRef(0)
    const { filter } = useSelector((storeState) => storeState.generalModule)

    useEffect(() => {
        loadEvents(filter)
        item.current = 0
    }, [filter])

    useEffect(() => {
        if (performance.navigation.type === 1) {
          console.log("This page is reloaded");
          window.scrollTo({top: 0, left: 0});   
        } else {
          console.log("This page is not reloaded");
        }
      });
    useEffect(() => {
        window.addEventListener("wheel", preventScroll, { passive: false })
        window.addEventListener("wheel", onWheel,{ passive: false })
        return () => {
            window.removeEventListener("wheel", preventScroll)
            window.removeEventListener("wheel", onWheel)
        }  
    }, [item.current])

    function onWheel(e) {
        window.removeEventListener("wheel", onWheel)
        if (e.deltaY > 0) scrollTo(1)
        else scrollTo(-1)
    }

    const preventScroll = (e) => {
        e.preventDefault()
    }

    const resetListener = () => {
        setTimeout(() => window.addEventListener("wheel", onWheel,{ passive: false }), 200)
    }

    const loadEvents = async (filter) => {
        let loadedEvents = await eventService.query(filter)
        setEvents(loadedEvents)
        eventLen.current = loadedEvents.length
    }

    const scrollTo = (val) => {
        console.log("im here ", item.current , "val ", val  , " event length ", eventLen.current)
        resetListener()
        if (item.current + val > eventLen.current || item.current + val < 0) return
        else if(item.current + val > eventLen.current) item.current = 0
        else item.current = item.current + val
        let elm = document.getElementById(item.current)
        elm.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
    }

    const showInfo = (ev) => {
        dispatch(setPopupInfo({
            player1name: ev.teamOneName,
            player2name: ev.teamTwoName,
            player1Img: ev.teamOneIcon,
            player2Img: ev.teamTwoIcon,
            player1About: ev.teamOneAbout,
            player2About: ev.teamTwoAbout,
        }))
        dispatch(setPopup('info'))
    }

    if (!events) return <p>loading...</p>

    return (
        <div className={`${mode.type} relative`}>
            <img className='featured-banner' src={require('../style/imgs/event-banner.png')} id={0}/>
            <div className='featured-text' >
                <p><span>bet</span> on the <span>biggest</span> event of the <span>year!</span></p>
                <div className='center'><button>Bet On</button></div>
            </div>

            {events.length > 0 ?
                <div className='events-wrapper'>{(events.map((event, idx) => <section id={idx+1} key={event._id} className='event-box-wrapper'>
                    <div className='event-box-side' >
                        <svg onClick={() => showInfo(event)} width="70" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="clickable hover-darker-svg info">
                            <path fillRule="evenodd" clipRule="evenodd" d="M80 40C80 62.0913 62.0914 80 40 80C17.9086 80 0 62.0913 0 40C0 17.9087 17.9086 0 40 0C62.0914 0 80 17.9087 80 40ZM39.8422 27.7241C41.9751 27.7241 43.7042 25.9951 43.7042 23.8623C43.7042 21.729 41.9751 20 39.8422 20C37.7092 20 35.98 21.729 35.98 23.8623C35.98 25.9951 37.7092 27.7241 39.8422 27.7241ZM42.7931 54.4829H48.3104C49.042 54.4829 49.7437 54.7734 50.261 55.2905C50.7783 55.8081 51.069 56.5098 51.069 57.2412C51.069 57.9731 50.7783 58.6748 50.261 59.1919C49.7437 59.7095 49.042 60 48.3104 60H31.7586C31.027 60 30.3253 59.7095 29.808 59.1919C29.2906 58.6748 29 57.9731 29 57.2412C29 56.5098 29.2906 55.8081 29.808 55.2905C30.3253 54.7734 31.027 54.4829 31.7586 54.4829H37.2759V37.9312H34.5172C33.7856 37.9312 33.0839 37.6406 32.5666 37.123C32.0493 36.606 31.7586 35.9038 31.7586 35.1724C31.7586 34.4409 32.0493 33.7393 32.5666 33.2217C33.0839 32.7046 33.7856 32.4136 34.5172 32.4136H42.7931V54.4829Z" fill="white" />
                        </svg>
                    </div>
                    <EventBox ev={event} />
                    <div className='event-box-side disappearable'>
                        <svg onClick={() => { scrollTo(-1) }} width="70" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="clickable hover-darker-svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M40 3.49691e-06C17.9086 5.4282e-06 -5.4282e-06 17.9086 -3.49691e-06 40C-1.56562e-06 62.0914 17.9086 80 40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 1.56562e-06 40 3.49691e-06ZM42.2668 59.2679C41.798 59.7366 41.1622 60 40.4993 60C39.8363 60 39.2005 59.7366 38.7317 59.2679C38.2629 58.7991 37.9995 58.1632 37.9995 57.5003L37.9995 28.5385L27.2707 39.2723C26.8013 39.7417 26.1647 40.0054 25.5009 40.0054C24.8371 40.0054 24.2005 39.7417 23.7311 39.2723C23.2617 38.8029 22.998 38.1663 22.998 37.5025C22.998 36.8387 23.2617 36.2021 23.7311 35.7327L38.7294 20.7344C38.9616 20.5016 39.2375 20.3169 39.5412 20.1909C39.8449 20.0649 40.1705 20 40.4993 20C40.8281 20 41.1536 20.0649 41.4573 20.1909C41.761 20.3169 42.0369 20.5016 42.2691 20.7344L57.2674 35.7327C57.4998 35.9651 57.6842 36.241 57.8099 36.5447C57.9357 36.8484 58.0005 37.1738 58.0005 37.5025C58.0005 37.8312 57.9357 38.1567 57.8099 38.4603C57.6842 38.764 57.4998 39.0399 57.2674 39.2723C57.035 39.5047 56.7591 39.6891 56.4554 39.8149C56.1517 39.9407 55.8263 40.0054 55.4976 40.0054C55.1689 40.0054 54.8434 39.9407 54.5398 39.8149C54.2361 39.6891 53.9602 39.5047 53.7278 39.2723L42.999 28.5385L42.999 57.5003C42.999 58.1632 42.7356 58.7991 42.2668 59.2679Z" fill="white" />
                        </svg>
                        <svg onClick={() => { scrollTo(1) }} width="70" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="clickable hover-darker-svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80ZM37.7332 20.7321C38.202 20.2634 38.8378 20 39.5008 20C40.1637 20 40.7995 20.2634 41.2683 20.7321C41.7371 21.2009 42.0005 21.8368 42.0005 22.4997L42.0005 51.4615L52.7293 40.7277C53.1987 40.2583 53.8353 39.9946 54.4991 39.9946C55.1629 39.9946 55.7995 40.2583 56.2689 40.7277C56.7383 41.1971 57.002 41.8337 57.002 42.4975C57.002 43.1613 56.7383 43.7979 56.2689 44.2673L41.2705 59.2656C41.0383 59.4984 40.7625 59.6831 40.4588 59.8091C40.1551 59.9351 39.8295 60 39.5007 60C39.1719 60 38.8464 59.9351 38.5427 59.8091C38.239 59.6831 37.9631 59.4984 37.7309 59.2656L22.7326 44.2673C22.5002 44.0349 22.3158 43.759 22.1901 43.4553C22.0643 43.1516 21.9995 42.8262 21.9995 42.4975C21.9995 42.1688 22.0643 41.8433 22.1901 41.5397C22.3158 41.236 22.5002 40.9601 22.7326 40.7277C22.965 40.4953 23.2409 40.3109 23.5446 40.1851C23.8483 40.0593 24.1737 39.9946 24.5024 39.9946C24.8311 39.9946 25.1566 40.0593 25.4602 40.1851C25.7639 40.3109 26.0398 40.4953 26.2722 40.7277L37.001 51.4615L37.001 22.4997C37.001 21.8368 37.2644 21.2009 37.7332 20.7321Z" fill="white" />
                        </svg>
                    </div>
                </section>))}</div>

                : //none found
                <div className="center not-found">
                    <img className="no-history" src={require('../style/imgs/no-results.png')} />
                    <p>Oops! it seems there are no results that matches your search...</p>
                    <p onClick={() => dispatch(setFilter(''))} className='main-color clickable'>View all events</p>
                </div>}
        </div>
    )
}