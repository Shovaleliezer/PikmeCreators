import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { eventService } from '../services/eventService'
import { setFilter } from '../store/actions/general.actions'
import { EventBox } from '../cmps/event-box'
import { FilterBar } from '../cmps/filter-bar'
import { isMobile } from 'react-device-detect'

export function Home(props) {
    const dispatch = useDispatch()
    const [events, setEvents] = useState([])
    const { filter } = useSelector((storeState) => storeState.generalModule)
    let gridView = events.length <= 9 ? '30%' : '300px'

    useEffect(() => {
        loadEvents(filter)
    }, [filter])

    const loadEvents = async (filter) => {
        const loadedEvents = await eventService.query(filter)
        setEvents(loadedEvents.slice(0, 4))
    }

    useEffect(() => {
        window.addEventListener("wheel", e => handleScrolling(e), { passive: false })
        return window.removeEventListener("wheel",e => handleScrolling(e))
    }, [])

    const handleScrolling = (e) => {
        e.preventDefault()
        // if (e.wheelDeltaY > 0) console.log('up')
        // else console.log('down')

        const element = document.getElementsByClassName("event-preview")[0]
        element.scrollIntoView({alignToTop:true})
    }

    if (!events) return <p>loading...</p>

    return (
        <div className={props.mode.type}>
            <FilterBar mode={props.mode} />
            {events.length >= 5 && <section className='events-container' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${gridView}, 1fr))` }}>
                {events.map(ev => <EventBox margin={false} ev={ev} mode={props.mode} key={ev._id} />)}
            </section>}

            {(events.length < 5 && events.length > 0) && <section className='container-few' scroll="no">
                {events.map((ev,idx) => <EventBox margin={true} ev={ev} mode={props.mode} key={ev._id}/>)}
            </section>}

            {events.length === 0 && <div className="center not-found">
                <img className="no-history" src={require('../style/imgs/no-results.png')} />
                <p>Oops! it seems there are no results that matches your search...</p>
                <p onClick={() => dispatch(setFilter(''))} className='main-color clickable'>View all events</p>
            </div>}
        </div>
    )
}
