import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPopup } from '../store/actions/general.actions'

export function Edit() {
    const dispatch = useDispatch()
    const popupEvent = useSelector((state) => state.generalModule.popupEvent)
    const [event, setEvent] = useState({
        category: popupEvent.category,
        game: popupEvent.game,
        opponent: popupEvent.opponent,
        date: popupEvent.date,
        description: popupEvent.description,
        shareWithCommunity: popupEvent.shareWithCommunity
    })
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
    }

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setEvent({ ...event, [name]: value });
    }

    return <form className='create' onSubmit={editEvent}>
        <div className='create-upper'>
            <img src={require('../style/imgs/create-stream.png')} />
            <h1>Edit your stream</h1>
            <img src={require('../style/imgs/close-icon.png')} onClick={() => { dispatch(setPopup('')) }} />
        </div>
        <div className='all-select-wrapper'>
            <div className='h3-wrapper'>
                <h3>Category</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/${img.category}.png`)} />
                    <select onChange={(e) => { handleImg(e); handleChange(e) }} name='category' value={event.category}>
                        <option value="gaming">Gaming</option>
                        <option value="sports">Sports</option>
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
                    <input type="datetime-local" name='date' required onChange={handleChange} value={event.date.slice(0, 16)} />
                </div>
            </div>
        </div>
        <div className='area-wrapper'>
            <h3>Description</h3>
            <textarea placeholder="insert description" name='description' required onChange={handleChange} value={event.description} />
        </div>
        <div className='center'>
            <button>Create!</button>
        </div>
    </form>
}