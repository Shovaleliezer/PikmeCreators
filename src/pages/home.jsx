import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { eventService } from '../services/eventService'
import { setFilter } from '../store/actions/general.actions'
import { EventBox } from '../cmps/event-box'

export function Home({ mode }) {
    const dispatch = useDispatch()
    const [events, setEvents] = useState([])
    const [item, setItem] = useState(0)
    const { filter } = useSelector((storeState) => storeState.generalModule)

    useEffect(() => {
        loadEvents(filter)
    }, [filter])

    const arrowClick = (val) => {
        if (item + val >= events.length || item + val < 0) return
        setItem(item + val)
    }

    const loadEvents = async (filter) => {
        let loadedEvents = await eventService.query(filter)
        setEvents(loadedEvents)
    }

    if (!events) return <p>loading...</p>

    return (
        <div className={`${mode.type} relative`}>
            <img className='featured-banner' src={require('../style/imgs/event-banner.png')} onClick={() => dispatch(setFilter('lol'))} />
            <div className='featured-text' onClick={() => dispatch(setFilter('lol'))}>
                <p><span>bet</span> on the <span>biggest</span> event of the <span>year!</span></p>
                <div className='center'><button>Bet On</button></div>
            </div>

            {events.length > 0 ? <section className='event-box-wrapper'>
                <div className='event-box-side'>
                    <div className='event-box-nav noselect'><img src={require('../style/imgs/info.png')} /></div>
                </div>
                <EventBox ev={events[item]} />
                <div className='event-box-side disappearable'>
                    <div onClick={() => { arrowClick(-1) }} className='event-box-nav noselect'>
                        <span className="material-symbols-outlined">arrow_upward</span></div>
                    <div onClick={() => { arrowClick(1) }} className='event-box-nav noselect'>
                        <span className="material-symbols-outlined">arrow_downward</span></div>

                </div>
            </section> :
                <div className="center not-found">
                    <img className="no-history" src={require('../style/imgs/no-results.png')} />
                    <p>Oops! it seems there are no results that matches your search...</p>
                    <p onClick={() => dispatch(setFilter(''))} className='main-color clickable'>View all events</p>
                </div>}
        </div>
    )
}
