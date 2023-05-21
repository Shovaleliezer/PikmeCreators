import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPopup } from '../store/actions/general.actions'

export function PopupStats({ stats }) {
    const dispatch = useDispatch()
    const { players, totalTickets, totalViewers,game } = stats
    const [isMoney, setIsMoney] = useState(true)

    if (stats === 'no-tickets') return (<>
        <h1>no tickets</h1>
    </>)

    return (<>
        <div className='analytics'>
        <div className='upper'>
            <img src={require('../style/imgs/create-stream.png')} style={{cursor:'auto'}}/>
            <h1>{game}</h1>
            <img className='clickable' src={require('../style/imgs/close-icon.png')} onClick={() => dispatch(setPopup(''))} />
        </div>
            <div className='display'>
                <p className={isMoney ? 'active' : 'inactive'} onClick={() => setIsMoney(true)}>{totalTickets}</p>
                <p className={!isMoney ? 'active' : 'inactive'} onClick={() => setIsMoney(false)}>{totalViewers}</p>
            </div>

        </div>
    </>)
}