import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPopup, setUpperPopup } from '../store/actions/general.actions'
import { setCreatePhase } from '../store/actions/tutorial.actions'
import { eventService } from '../services/event.service'

export function Create() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [img, setImg] = useState({ category: 'sports', game: 'table-tennis' })
    const [category, setCategory] = useState('sports')
    const [isShare, setIsShare] = useState(true)
    const [sent, setSent] = useState(false)
    const categoryRef = useRef()
    const gameRef = useRef()
    const dateRef = useRef()

    const { createPhase } = useSelector((state) => state.tutorialModule)
    if (createPhase === 0) dispatch(setCreatePhase(1))

    const handleImg = (e) => {
        const { name, value } = e.target
        if (name === 'category') {
            setCategory(value)
            if (value === 'gaming') setImg({ category: 'gaming', game: 'valorant' })
            else setImg({ category: 'sports', game: 'table-tennis' })
        }
        else setImg({ ...img, [name]: value })
    }

    const addEvent = async (e) => {
        e.preventDefault()
        setSent(true)
        const date = new Date(dateRef.current.value)
        const utcString = date.toUTCString()
        const newEvent = {
            category: categoryRef.current.value,
            game: gameRef.current.value,
            date: utcString,
            shareWithCommunity: isShare,
            player: user.creator
        }

        try {
            const { _id } = await eventService.addEvent(newEvent, user.creator.walletAddress)
            dispatch(setPopup(_id))
        }
        catch {
            dispatch(setUpperPopup('error'))
            dispatch(setPopup(''))
        }
    }
    if (sent) return <div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>

    return <form className='create' onSubmit={addEvent}>
        <div className='create-upper'>
            <img src={require('../style/imgs/create-stream.png')} />
            <h1>Create New Stream</h1>
            <img src={require('../style/imgs/close-icon.png')} onClick={() => dispatch(setPopup(''))} />
        </div>
        <div className='all-select-wrapper'>
            <div className='h3-wrapper'>
                <h3>Category</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/${img.category}.png`)} />
                    <select disabled={true} ref={categoryRef} onChange={handleImg} name='category'>
                        <option value="sports">Sports</option>
                        <option value="gaming">Gaming</option>
                    </select>
                </div>
            </div>
            <div className='h3-wrapper'>
                <h3>Game</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/${img.game}.png`)} />
                    <select ref={gameRef} onChange={handleImg} name='game' required>
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
                    <input type="datetime-local" ref={dateRef} required></input>
                </div>
            </div>
            <div className='checkbox-wrapper' style={{ zIndex: createPhase === 1 ? '1001' : '0' }}>
                <div className='checkbox' onClick={() => setIsShare(!isShare)}>
                    {isShare && <span className="main-color noselect material-symbols-outlined">done</span>}
                </div>
                <p>Share with community</p>
            </div>
        </div>
        <div className='center'>
            <button>Create!</button>
        </div>
    </form>
}