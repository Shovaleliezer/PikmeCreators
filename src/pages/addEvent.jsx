import { useState, useRef } from 'react'

export const AddEvent = () => {

    const title = useRef()
    const category = useRef()
    const game = useRef()
    const date = useRef()
    const description = useRef()
    const community = useRef()
    const team1 = useRef()
    const team1address = useRef()
    const team1img = useRef()
    const team2 = useRef()
    const team2address = useRef()
    const team2img = useRef()

    const [isGamingPicked, setIsGamingPicked] = useState(false)

    const addEvent = (e) => {
        e.preventDefault()
        const event = {
            title: title.current.value,
            category: category.current.value,
            game: game.current.value, 
            date: date.current.value,
            description : description.current.value,
            community: category.current.value === 'yes'? true : false
            category: category.current.value,

        }
        
    }

    const toggleGaming = () => {
        if (category.current.value === 'gaming') setIsGamingPicked(true)
        else setIsGamingPicked(false)
    }

    return (
        <section className="add-event">

            <form onSubmit={addEvent}>
                <h1 className="center">ADD EVENT</h1>

                <input type='text' placeholder='title' required ref={title}/>

                <label>category:</label>
                <select name="category" ref={category} onChange={toggleGaming}>
                    <option value="sport">sport</option>
                    <option value="gaming">gaming</option>
                    <option value="singing">singing</option>
                </select>

                {isGamingPicked && <label>game:</label>}
                {isGamingPicked && <select ref={game} >
                    <option value="volvo">fifa</option>
                    <option value="saab">cs go</option>
                    <option value="mercedes">valorant</option>
                </select>}

                <label>event date:</label>
                <input type="date" ref={date} required></input>

                <input type='text' ref={description} placeholder='description' required />

                <label>share with community?</label>
                <select ref={community}>
                    <option value='yes'>yes</option>
                    <option value="gaming">no</option>
                </select>

                <input type='text' ref={team1} placeholder='team1' required />
                <input type='text' ref={team1address} placeholder='team1 address' required />
                <label>team 1 pic</label>
                <input type="file" ref={team1img} accept="image/png, image/jpeg" required></input>

                <input type='text' ref={team2} placeholder='team2' required />
                <input type='text' ref={team2address} placeholder='team2 address' required />
                <label>team 2 pic</label>
                <input type="file" ref={team2img}  accept="image/png, image/jpeg" required></input>
                
                <button className="clickable register-button"> Continue </button>
            </form>

        </section>
    )
}