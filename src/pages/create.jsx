import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPopup, setUpperPopup } from '../store/actions/general.actions'
import { eventService } from '../services/event.service'
import { games } from '../services/games.service'
import { httpService } from '../services/http.service'

export function Create() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [img, setImg] = useState({ category: 'sports', game: 'table-tennis' })
    const [category, setCategory] = useState('sports')
    const [sent, setSent] = useState(false)
    const [isFund, setIsFund] = useState(false)
    const categoryRef = useRef()
    const dateRef = useRef()
    const descRef = useRef()
    const linkRef = useRef()
    const prizeRef = useRef()
    const targetRef = useRef()
    const [gameField, setGameField] = useState('table-tennis')
    const uploads = {
        img: useRef(),
        video: useRef()
    }
    const [uploadsState, setUploadsState] = useState({
        img: '',
        video: ''
    })

    const handleImg = (e) => {
        const { name, value } = e.target
        if (name === 'category') {
            setCategory(value)
            if (value === 'gaming') setImg({ category: 'gaming', game: 'valorant' })
            else setImg({ category: 'sports', game: 'table-tennis' })
        }
        else {
            setGameField(value)
            setImg({ ...img, [name]: value })
        }
    }

    const addEvent = async (e) => {
        e.preventDefault()
        try {
            const date = new Date(dateRef.current.value)
            if (new Date(Date.now()) > new Date(dateRef.current.value)) {
                setSent(false)
                dispatch(setUpperPopup('date'))
                return
            }
            dispatch(setPopup('upload-event'))
            const utcString = date.toUTCString()
            let newEvent
            let vid = ''
            let file = uploads.video.current ? uploads.video.current.files[0] : null
            if (file) {
                const d = await getVideoDuration(file)
                if (d > 61) {
                    dispatch(setUpperPopup('video-length'))
                    dispatch(setPopup(''))
                    return
                }
                const formData = new FormData()
                formData.append('file', file)
                vid = await httpService.compressAndUpload(formData)
            }
            newEvent = {
                category: 'sports',
                game: gameField,
                date: utcString,
                shareWithCommunity: false,
                player: user.creator,
                video: vid
            }

            if (isFund) newEvent.fund = {
                description: descRef.current.value,
                prize: prizeRef.current.value,
                target: targetRef.current.value,
                link: linkRef.current.value,
                current: 0,
                investors: {}
            }

            const { _id, game, video } = await eventService.addEvent(newEvent, user.creator.walletAddress)
            if (!isFund) dispatch(setPopup(_id + '/' + user.creator.nickName + '*' + game))
            else dispatch(setPopup('created'))
        }

        catch (err) {
            console.log(err)
            dispatch(setUpperPopup('errorCreate'))
            dispatch(setPopup(''))
        }

    }

    const getVideoDuration = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const media = new Audio(reader.result)
                media.onloadedmetadata = () => resolve(media.duration)
            }
            reader.readAsDataURL(file)
            reader.onerror = error => reject(error)
        })


    const handleUpload = (e) => {
        const { files, name } = e.target
        setUploadsState({ ...uploadsState, [name]: files[0] ? files[0].name : '' })
    }

    if (sent) return <div className='center' style={{ height: 'calc(100vh - 315px)' }}><div className="loader loader-block"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div>

    return <form className='create' onSubmit={addEvent}>
        <div>
            <div className='create-upper'>
                <h1>Create New Stream</h1>
            </div>
            <div className='create-type'>
                <p className={!isFund ? 'active' : 'inactive'} onClick={() => setIsFund(false)}>VS Event</p>
                <p className={isFund ? 'active' : 'inactive'} onClick={() => setIsFund(true)}>Funding Event</p>
            </div>
            {
                !isFund &&
                <div className='all-select-wrapper'>
                    <div className='h3-wrapper'>
                        <h3>Category</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${img.category}.png`)} />
                            <select disabled={true} ref={categoryRef} onChange={handleImg} name='category'>
                                <option value="sports">Competition</option>
                                <option value="gaming">Gaming</option>
                            </select>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${img.game}.png`)} />
                            <select onChange={handleImg} name='game' required>
                                {category === 'gaming' ? <>
                                    <option value="valorant">Valorant</option>
                                    <option value="fifa">Fifa</option></> :
                                    <>
                                        {games.map(g => <option key={g.game} value={g.game}>{g.display}</option>)}
                                    </>}
                            </select>
                        </div>
                    </div>
                    <div className='h3-wrapper date'>
                        <h3>Date</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/calendar.png`)} />
                            <input type="datetime-local" className='date-special' ref={dateRef} required></input>
                        </div>
                    </div>
                </div>
            }
            {
                isFund && <div className='all-select-wrapper'>
                    <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${img.game}.png`)} />
                            <select onChange={handleImg} name='game' required>
                                {category === 'gaming' ? <>
                                    <option value="valorant">Valorant</option>
                                    <option value="fifa">Fifa</option></> :
                                    <>
                                        {games.map(g => <option key={g.game} value={g.game}>{g.display}</option>)}
                                    </>}
                            </select>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Date</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/calendar.png`)} />
                            <input type="datetime-local" className='date-special' ref={dateRef} required></input>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Target</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/target.png`)} />
                            <input min='0.01' className='date-special' step="0.01" placeholder='100 BNB' type="number" ref={targetRef} required></input>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Prize</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/achievement.png`)} />
                            <input min='0.01' placeholder='1,000 BNB' step="0.01" className='date-special' type="number" ref={prizeRef} required></input>
                        </div>
                    </div>
                    <div className='h3-wrapper' style={{ width: '100%' }}>
                        <h3>Description</h3>
                        <textarea maxLength={220} required className='fund-desc' placeholder='Tell us about the competition...' ref={descRef} />
                    </div>
                    <div className='h3-wrapper' style={{ width: '100%' }}>
                        <h3>Link (optional)</h3>
                        <input className='link' placeholder='Link to competiton page' ref={linkRef} />
                    </div>
                </div>
            }

            <div className='h3-wrapper' style={{ width: '100%' }}>
                <h3>Teaser video (optional, up to 1 minute)</h3>
                <input id='vid' name='video' className="non-appear" type="file" placeholder="Upload your image" accept="video/mp4,video/x-m4v,video/*" ref={uploads.video} onChange={handleUpload} />
                <label htmlFor='vid' className='link clickable' style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                    {uploadsState.video ? <span>{uploadsState.video.slice(0, 24) + '...'}</span> : <span className="material-symbols-outlined">drive_folder_upload</span>}
                </label>
            </div>
        </div>
        <button>Create!</button>
    </form>
}