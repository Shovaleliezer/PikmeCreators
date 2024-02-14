import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { setPopup, setUpperPopup } from '../store/actions/general.actions'
import { uploadFile } from '../services/upload.service'
import { httpService } from '../services/http.service'

export function ControlCreate() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const nameRef = useRef()
    const descRef = useRef()
    const longDescRef = useRef()
    const linkRef = useRef()
    const titleRef = useRef()
    const priceRef = useRef()
    const [date, setDate] = useState(new Date())
    const img = useRef()
    const video = useRef()
    const [uploadsState, setUploadsState] = useState({
        img: '',
        video: ''
    })

    useEffect(() => {
        window.scrollTo(0, 0)
        if (user.creator.banned) navigate('/ban')
    }, [])

    const addShow = async (e) => {
        e.preventDefault()
        try {
            if (new Date() > new Date(date)) {
                dispatch(setUpperPopup('date'))
                return
            }
            const formData = new FormData()
            dispatch(setPopup('upload-event'))
            if (!img.current.files[0]) {
                dispatch(setUpperPopup('imgRequired'))
                dispatch(setPopup(''))
                return
            }
            if(priceRef.current.value < 1 || priceRef.current.value > 1000){
                dispatch(setUpperPopup('price'))
                dispatch(setPopup(''))
                return
            }
            let vid = ''
            let videoId = ''
            let file = video.current ? video.current.files[0] : null
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
            const utcString = date.toUTCString()
            const { url } = await uploadFile(img.current.files[0])

            const show = {
                date: utcString,
                video: vid,
                videoId,
                title: titleRef.current.value,
                description: descRef.current.value,
                longDescription: longDescRef.current.value,
                performerName: nameRef.current.value,
                link: linkRef.current.value,
                img: url,
                price: priceRef.current.value,
            }


            formData.append('playerAddress', user.creator.walletAddress)
            formData.append('show', JSON.stringify(show))
            const newShow = await httpService.addEvent(formData, true)
            console.log(newShow)
            dispatch(setPopup('created-show'))
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

    return <form className='create' onSubmit={addShow}>
        <div>
            <div className='all-select-wrapper'>
                <div className='h3-wrapper'>
                    <h3>Performer name</h3>
                    <div className='select-wrapper'>
                        <img src={require(`../style/imgs/register/performer.webp`)} />
                        <input required maxLength={15} ref={nameRef} className='performer' />
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Ticket price</h3>
                    <div className='select-wrapper' style={{ minHeight: '43px' }}>
                        <input type='number' className='performer' required ref={priceRef} style={{ width: '280px' }} placeholder='₪'/>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Date</h3>
                    <div className='select-wrapper' style={{ minHeight: '43px' }}>
                        <img src={require(`../style/imgs/register/calendar.png`)} />
                        <input type="datetime-local" className='date-special' onChange={handleDate} required></input>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Performer image</h3>
                    <div className='select-wrapper'>
                        <input id='img' name='img' className="non-appear" type="file" placeholder="Upload your image" accept="image/*" ref={img} onChange={handleUpload} />
                        <label htmlFor='img' className='clickable performer upload-video' style={{ textAlign: 'center', display: 'block', fontSize: '24px', width: '280px' }} >
                            {uploadsState.img ? <span>{uploadsState.img.slice(0, 12) + '...'}</span> : <span className="material-symbols-outlined">drive_folder_upload</span>}
                        </label>
                    </div>
                </div>
                <div className='h3-wrapper' style={{ width: '100%' }}>
                    <h3>event title</h3>
                        <input maxLength={50}  required ref={titleRef} className='link'/>
                </div>
                <div className='h3-wrapper' style={{ width: '100%' }}>
                    <h3>short description</h3>
                    <textarea maxLength={220} required className='fund-desc' placeholder='Tell us more about the event...' ref={descRef} />
                </div>
                <div className='h3-wrapper' style={{ width: '100%' }}>
                    <h3>Long description (optional)</h3>
                    <textarea maxLength={1200} required className='fund-desc' placeholder='add more details if any...' ref={longDescRef} />
                </div>
                <div className='h3-wrapper' style={{ width: '100%' }}>
                    <h3>Link (optional)</h3>
                    <input className='link' placeholder='Link to competiton page' ref={linkRef} maxLength={100} />
                </div>
            </div>

            <div className='h3-wrapper' style={{ width: '100%' }}>
                <h3>Teaser video (optional, up to 1 minute)</h3>
                <input id='vid' name='video' className="non-appear" type="file" placeholder="Upload your video" accept="video/mp4,video/x-m4v,video/*" ref={video} onChange={handleUpload} />
                <label htmlFor='vid' className='link clickable' style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                    {uploadsState.video ? <span>{uploadsState.video.slice(0, 24) + '...'}</span> : <span className="material-symbols-outlined">drive_folder_upload</span>}
                </label>
            </div>
        </div>
        <button>Create!</button>
    </form>
}