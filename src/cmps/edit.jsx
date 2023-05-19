import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPopup, setUpperPopup } from '../store/actions/general.actions'
import { eventService } from '../services/event.service'

export function Edit() {
    const dispatch = useDispatch()
    const popupEvent = useSelector((state) => state.generalModule.popupEvent)
    let date = new Date(popupEvent.date)
    date = date.getFullYear() + "-" + (date.getMonth()+1).toString().padStart(2, '0') + "-" + date.getDate() + "T" + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
    const [event, setEvent] = useState({
        category: popupEvent.category,
        game: popupEvent.game,
        date: date,
    })
    const [fund, setFund] = useState(popupEvent.fund ? {
        description: popupEvent.fund.description,
        prize: popupEvent.fund.prize,
        target: popupEvent.fund.target,
        investors: {},
        current: 0
    } : null)

    const [sent, setSent] = useState(false)
    const [img, setImg] = useState({ category: event.category, game: event.game })
    const [category, setCategory] = useState(event.category)

    const handleImg = (e) => {
        const { name, value } = e.target
        if (name === 'category') {
            setCategory(value)
            if (value === 'gaming') setImg({ category: 'gaming', game: 'valorant' })
            else setImg({ category: 'sports', game: 'table-tennis' })
        }
        else setImg({ ...img, [name]: value })
    }

    const editEvent = async (e) => {
        e.preventDefault()
        if (fund && fund.description.length < 20) {
            dispatch(setUpperPopup('desc'))
            return
        }
        try {
            setSent(true)
            const newEv = await eventService.editEvent(popupEvent._id, popupEvent.fund ? { ...event, fund } : event)
            if (newEv) {
                dispatch(setPopup(''))
                window.location.reload()
            }
        }
        catch {
            console.log('error')
        }
    }

    const handleChange = (ev) => {
        const { name, value } = ev.target
        setEvent({ ...event, [name]: value })
    }

    const handleFund = (ev) => {
        const { name, value } = ev.target
        setFund({ ...fund, [name]: value })
    }

    if (sent) return <div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>

    return <form className='create' onSubmit={editEvent}>
        <div className='create-upper'>
            <img src={require('../style/imgs/create-stream.png')} />
            <h1>Edit your stream</h1>
            <img src={require('../style/imgs/close-icon.png')} onClick={() => { dispatch(setPopup('')) }} />
        </div>
        {!popupEvent.fund && <div className='all-select-wrapper'>
            <div className='h3-wrapper'>
                <h3>Category</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/${img.category}.png`)} />
                    <select disabled={true} onChange={(e) => { handleImg(e); handleChange(e) }} name='category' value={event.category}>
                        <option value="sports">Sports</option>
                        <option value="gaming">Gaming</option>
                    </select>
                </div>
            </div>
            <div className='h3-wrapper'>
                <h3>Game</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/${img.game}.png`)} />
                    <select onChange={(e) => { handleImg(e); handleChange(e) }} name='game' required value={event.game}>
                        {category === 'gaming' ? <>
                            <option value="valorant">Valorant</option>
                            <option value="fifa">Fifa</option></> :
                            <>
                                <option value="table-tennis">Table tennis</option>
                                <option value="poker">Poker</option>
                            </>}
                    </select>
                </div>
            </div>
            <div className='h3-wrapper date'>
                <h3>Date</h3>
                <div className='select-wrapper'>
                    <input type="datetime-local" name='date' required onChange={handleChange} value={event.date} />
                </div>
            </div>
        </div>}
        {popupEvent.fund && <div className='all-select-wrapper'>
            <div className='h3-wrapper'>
                <h3>Game</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/${img.game}.png`)} />
                    <select onChange={(e) => { handleImg(e); handleChange(e) }} name='game' required value={event.game}>
                        {category === 'gaming' ? <>
                            <option value="valorant">Valorant</option>
                            <option value="fifa">Fifa</option></> :
                            <>
                                <option value="table-tennis">Table tennis</option>
                                <option value="poker">Poker</option>
                            </>}
                    </select>
                </div>
            </div>
            <div className='h3-wrapper'>
                <h3>Date</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/calendar.png`)} />
                    <input type="datetime-local" onChange={handleChange} name='date' className='date-special' value={event.date} required></input>
                </div>
            </div>
            <div className='h3-wrapper'>
                <h3>Target</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/target.png`)} />
                    <input name='target' onChange={handleFund} className='date-special' placeholder='100 BNB' type="number" value={fund.target} required></input>
                </div>
            </div>
            <div className='h3-wrapper'>
                <h3>Prize</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/achievement.png`)} />
                    <input name='prize' onChange={handleFund} placeholder='1000BNB' className='date-special' type="number" value={fund.prize} required></input>
                </div>
            </div>
            <div className='h3-wrapper' style={{ width: '100%' }}>
                <h3>Description</h3>
                <textarea name='description' onChange={handleFund} className='fund-desc' placeholder='Tell us about the competition...' value={fund.description} />
            </div>
        </div>}
        <div className='center'>
            <button>Confirm</button>
        </div>
    </form>
}