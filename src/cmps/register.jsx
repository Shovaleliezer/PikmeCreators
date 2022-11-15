import { useState, useRef } from 'react'
import { uploadService } from '../services/upload.service.js'
import { RegisterProgress } from './register-progress.jsx'

export function Register() {
    const [phase, setPhase] = useState(1)
    const [creatorDetails, setCreatorDetails] = useState({
        name: '',
        img: '',
        category: '',
        game: '',
        region: '',
        topAchivement: '',
        status: '',
        experience: '',
        social: ''
    })
    const nameRef = useRef()
    const imgRef = useRef()
    const categoryRef = useRef()
    const gameRef = useRef()
    const regionRef = useRef()
    const topAchivementRef = useRef()
    const statusRef = useRef()
    const experienceRef = useRef()
    const socialRef = useRef()



    const completePhase1 = async (e) => {
        e.preventDefault()
        const uploadedImg = await uploadService.uploadImg(imgRef.current.files[0])
        setCreatorDetails({ ...creatorDetails, img: uploadedImg.secure_url, name: nameRef.current.value })
        setPhase(2)
    }

    return <section className="register">
        {phase === 1 && <>
            <h1>Create a Nickname</h1>
            <form className='phase1' onSubmit={completePhase1}>
                <h3>Nickname</h3>
                <input type="text" placeholder="Enter your nickname" required maxLength={15} ref={nameRef} />
                <h3>Image</h3>
                <label htmlFor='img'><div className="upload-img"><img src={require('../style/imgs/img-upload.png')} /></div></label>
                <input id='img' className="non-appear" type="file" placeholder="Upload your image" accept="image/*" required ref={imgRef} />
                <button>Continue <span class="material-symbols-outlined">arrow_forward</span></button>
            </form></>}
            <RegisterProgress phase={phase}/>
    </section >
}