import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { setPopup, setUpperPopup } from '../store/actions/general.actions'
import { games } from '../services/data.service'
import { uploadFile } from '../services/upload.service'
import { httpService } from '../services/http.service'

export function Create() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const [img, setImg] = useState({ category: 'sports', game: 'table-tennis' })
    const [prize, setPrize] = useState('')
    const [target, setTarget] = useState('')
    const [category, setCategory] = useState('sports')
    const [type, setType] = useState('vs')
    const descRef = useRef()
    const linkRef = useRef()
    const [gameField, setGameField] = useState('table-tennis')
    const [date, setDate] = useState(new Date())
    const uploads = {
        img: useRef(),
        video: useRef()
    }
    const [uploadsState, setUploadsState] = useState({
        img: '',
        video: ''
    })

    useEffect(() => {
        window.scrollTo(0, 0)
        if (user.creator.banned) navigate('/ban')
    }, [])

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
            if (new Date() > new Date(date)) {
                dispatch(setUpperPopup('date'))
                return
            }
            const formData = new FormData()
            dispatch(setPopup('upload-event'))
            const utcString = date.toUTCString()
            let newEvent
            let vid = ''
            let videoId = ''
            let file = uploads.video.current ? uploads.video.current.files[0] : null
            if (file) {
                if (file.size > 500_000_000) {
                    dispatch(setUpperPopup('video-size'))
                    dispatch(setPopup(''))
                    return
                }
                const d = await getVideoDuration(file)
                if (d > 61) {
                    dispatch(setUpperPopup('video-length'))
                    dispatch(setPopup(''))
                    return
                }
                if (file.size < 15_000_000) {
                    const cl = await uploadFile(file)
                    vid = cl.url
                    videoId = cl.public_id
                }
                else formData.append('file', file)
            }

            newEvent = {
                category: 'sports',
                game: gameField,
                date: utcString,
                shareWithCommunity: false,
                player: user.creator,
                video: vid,
                videoId
            }

            if (type === 'fund') newEvent.fund = {
                description: descRef.current.value,
                prize,
                target,
                link: linkRef.current.value,
                current: 0,
                investors: {}
            }

            formData.append('playerAddress', user.creator.walletAddress)
            formData.append('event', JSON.stringify(newEvent))
            const { _id, game } = await httpService.addEvent(formData)
            if (type === 'vs') dispatch(setPopup(_id + '/' + user.creator.nickName + '*' + game))
            else  dispatch(setPopup('created'))
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

    const handleDate = (e) => {
        const { value } = e.target
        const date = new Date(value)
        if (new Date(Date.now()) > new Date(date)) {
            dispatch(setUpperPopup('date'))
            return
        }
        setDate(date)
    }

    const handleNumbers = (e) => {
        const { name, value } = e.target
        if (value === '') {
            if (name === 'prize') return setPrize('')
            else return setTarget('')
        }
        if (value < 1) return dispatch(setUpperPopup('min1'))
        else if (value > 1000000) return dispatch(setUpperPopup('max1m'))
        else if ((value * 100 % 100).toString().includes('.')) return dispatch(setUpperPopup('decimals'))

        if (name === 'prize') setPrize(value)
        else setTarget(value)
    }

    return <form className='create' onSubmit={addEvent}>
        <div>
            <div className='create-upper'>
                <h1>Create New Event</h1>
            </div>
            <div className='create-type'>
                <p className={type === 'vs' ? 'active' : 'inactive'} onClick={() => setType('vs')}>VS</p>
                <p className={type === 'fund' ? 'active' : 'inactive'} onClick={() => setType('fund')}>Funding</p>
            </div>

            <div className='all-select-wrapper'>

                <div className='h3-wrapper'>
                    <h3>Game</h3>
                    <div className='select-wrapper'>
                        <img src={require(`../style/imgs/register/${img.game}.webp`)} />
                        <select onChange={handleImg} name='game' required>
                            {games.map(g => <option key={g.game} value={g.game}>{g.display}</option>)}
                        </select>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Date</h3>
                    <div className='select-wrapper' style={{ minHeight: '43px' }}>
                        <img src={require(`../style/imgs/register/calendar.png`)} />
                        <input type="datetime-local" className='date-special' onChange={handleDate} required></input>
                    </div>
                </div>

                {type === 'fund' && <>
                    <div className='h3-wrapper'>
                        <h3>Target</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/target.png`)} />
                            <input className='date-special' placeholder='100 BNB' type="number" value={target} name='target' onChange={handleNumbers} required></input>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Prize</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/achievement.png`)} />
                            <input placeholder='1,000 BNB' className='date-special' type="number" value={prize} name='prize' onChange={handleNumbers} required></input>
                        </div>
                    </div>
                    <div className='h3-wrapper' style={{ width: '100%' }}>
                        <h3>Description</h3>
                        <textarea maxLength={220} required className='fund-desc' placeholder='Tell us more about the event...' ref={descRef} />
                    </div>
                    <div className='h3-wrapper' style={{ width: '100%' }}>
                        <h3>Link (optional)</h3>
                        <input className='link' placeholder='Link to competiton page' ref={linkRef} maxLength={100} />
                    </div>
                </>}

            </div>

            {/* <div className='h3-wrapper' style={{ width: '100%' }}>
                <h3>Teaser video (optional, up to 1 minute)</h3>
                <input id='vid' name='video' className="non-appear" type="file" placeholder="Upload your video" accept="video/mp4,video/x-m4v,video/*" ref={uploads.video} onChange={handleUpload} />
                <label htmlFor='vid' className='link clickable' style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                    {uploadsState.video ? <span>{uploadsState.video.slice(0, 24) + '...'}</span> : <span className="material-symbols-outlined">drive_folder_upload</span>}
                </label>
            </div> */}
        </div>
        <button>Create!</button>
    </form>
}