import { useState, useRef } from 'react'
import { eventService } from '../services/eventService'
import { uploadService } from '../services/upload.service'

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
    const banner = useRef()

    const [isGamingPicked, setIsGamingPicked] = useState(false)

    const addEvent = async (e) => {
        e.preventDefault()
        try {
            const uploadedBanner = await uploadService.uploadImg(banner.current.files[0])
            const uploadedT1icon = await uploadService.uploadImg(team1img.current.files[0])
            const uploadedT2icon = await uploadService.uploadImg(team2img.current.files[0])
            const event = {
                title: title.current.value,
                description: description.current.value,
                category: category.current.value,
                game: game.current ? game.current.value : 'none',
                date: date.current.value,
                shareWithCommunity: community.current.value === 'yes' ? true : false,
                teamOneName: team1.current.value,
                teamOneAddress: team1address.current.value,
                teamTwoName: team2.current.value,
                teamTwoAddress: team2address.current.value,
                banner: uploadedBanner.secure_url,
                teamOneIcon: uploadedT1icon.secure_url,
                teamTwoIcon: uploadedT2icon.secure_url
            }
            await eventService.addEvent(event)
        }
        catch (error) {
            console.log(error)
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

                <input type='text' placeholder='title' required ref={title} />

                <label>category:</label>
                <select name="category" ref={category} onChange={toggleGaming}>
                    <option value="sport">sport</option>
                    <option value="gaming">gaming</option>
                    <option value="singing">singing</option>
                </select>

                {isGamingPicked && <label>game:</label>}
                {isGamingPicked && <select ref={game} >
                    <option value="fifa">fifa</option>
                    <option value="cs go">cs go</option>
                    <option value="valorant">valorant</option>
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
                <input type="file" ref={team2img} accept="image/png, image/jpeg" required></input>

                <label>banner:</label>
                <input type="file" ref={banner} accept="image/png, image/jpeg" required></input>

                <button className="clickable register-button"> Continue </button>
            </form>

        </section>
    )
}