import { useState,useRef } from 'react'

export function Create(){
    const [img, setImg] = useState({ category: 'gaming', game: 'valorant' })
    const [category, setCategory] = useState('gaming')
    const categoryRef = useRef()
    const gameRef = useRef()
    const dateRef = useRef()
    const descRef = useRef()

    const handleImg = (e) => {
        const { name, value } = e.target
        if(name === 'category'){
            if(value === 'gaming') setImg({ category: 'gaming', game: 'valorant' })
            else setImg({ category: 'sports', game: 'table-tennis' })
            setCategory(value)
        } 
        else setImg({ ...img, [name]: value })
    }

    const addEvent = async (e) => {
        e.preventDefault()
        const newEvent = {
            category: categoryRef.current.value,
            game: gameRef.current.value,
            date: dateRef.current.value,
            description: descRef.current.value
        }
        console.log(newEvent)
    }

    return <form className='phase2' onSubmit={addEvent}>
    <div className='all-select-wrapper'>
        <div className='h3-wrapper'>
            <h3>Category</h3>
            <div className='select-wrapper'>
                <img src={require(`../style/imgs/register/${img.category}.png`)} />
                <select ref={categoryRef} onClick={handleImg} name='category'>
                    <option value="gaming">Gaming</option>
                    <option value="sports">Sports</option>
                </select>
            </div>
        </div>
        {category === 'gaming' ? <div className='h3-wrapper'>
            <h3>Game</h3>
            <div className='select-wrapper'>
                <img src={require(`../style/imgs/register/${img.game}.png`)} />
                <select ref={gameRef} onClick={handleImg} name='game' required>
                    <option value="valorant">Valorant</option>
                    <option value="fifa">Fifa</option>
                </select>
            </div>
        </div> :
            <div className='h3-wrapper'>
                <h3>sport type</h3>
                <div className='select-wrapper'>
                    <img src={require(`../style/imgs/register/${img.game}.png`)} />
                    <select ref={gameRef} onClick={handleImg} name='game' required>
                        <option value="table-tennis">Table tennis</option>
                        <option value="poker">Poker</option>
                    </select>
                </div>
            </div>}
        <div className='h3-wrapper'>
            <h3>Date</h3>
            <div className='select-wrapper'>
            <input type="datetime-local" ref={dateRef} required></input>
            </div>
        </div>
        <div className='h3-wrapper'>
            <h3>Description</h3>
            <div className='select-wrapper'>
            <input type="text" placeholder="event description" required ref={descRef} />
            </div>
        </div>

    </div>
    <button>Create <span className="material-symbols-outlined">arrow_forward</span></button>
</form>
}