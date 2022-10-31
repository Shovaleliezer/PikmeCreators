import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { eventService } from '../services/eventService'
import { setFilter } from '../store/actions/general.actions'
import { EventBox } from '../cmps/event-box'

export function Home(props) {
    const dispatch = useDispatch()
    const [events, setEvents] = useState([])
    const { filter } = useSelector((storeState) => storeState.generalModule)
    let gridView = events.length <= 9 ? '30%' : '300px'

    useEffect(() => {
        loadEvents(filter)
    }, [filter])

    useEffect(() => {
        const element = document.getElementsByClassName("event-preview")[props.item]
        if (element) element.scrollIntoView({ alignToTop: true })
    }, [props.item])

    useEffect(() => {
        return function cleanup() {
            window.removeEventListener("wheel", props.handleScrolling)
            window.removeEventListener("wheel", props.preventScrolling)
        }
    }, [])
    

    const loadEvents = async (filter) => {
        let loadedEvents = await eventService.query(filter)
        loadedEvents = loadedEvents.slice(0, 1)
        setEvents(loadedEvents)
        props.setEventsLength(loadedEvents.length)
    }

    if (!events) return <p>loading...</p>

    return (
        <div className={props.mode.type}>
            {events.length >= 5 && <section className='events-container' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${gridView}, 1fr))` }}>
                {events.map(ev => <EventBox margin={false} ev={ev} mode={props.mode} key={ev._id} />)}
            </section>}

            {(events.length < 5 && events.length > 0) && <><section className='container-few'>
                {events.map((ev) => <EventBox margin={true} ev={ev} mode={props.mode} key={ev._id} />)}
            </section>
                {/* <div onClick={() => { props.arrowClick(-1) }} className='next-event up noselect'><span className="material-symbols-outlined">arrow_upward</span></div>
                <div onClick={() => { props.arrowClick(1) }} className='next-event down noselect'><span className="material-symbols-outlined">arrow_downward</span></div> */}
            </>}

            {events.length === 0 && <div className="center not-found">
                <img className="no-history" src={require('../style/imgs/no-results.png')} />
                <p>Oops! it seems there are no results that matches your search...</p>
                <p onClick={() => dispatch(setFilter(''))} className='main-color clickable'>View all events</p>
            </div>}
        </div>
    )
}
