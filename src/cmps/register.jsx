import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { uploadService } from '../services/upload.service.js'
import { RegisterProgress } from './register-progress.jsx'
import { getYears } from '../services/utils.js'
import { userService } from '../services/userService.js'

export function Register() {
    const navigate = useNavigate()
    const { address } = useSelector((state) => state.user)
    const [phase, setPhase] = useState(1)
    const [creatorDetails, setCreatorDetails] = useState({
        nickName: '',
        image: '',
        category: '',
        proficiencyGame: '',
        region: '',
        topAchievement: '',
        status: '',
        experience: '',
        socialLink: ''
    })
    const years = getYears()
    const nameRef = useRef()
    const imgRef = useRef()
    const categoryRef = useRef()
    const gameRef = useRef()
    const regionRef = useRef()
    const topAchivementRef = useRef()
    const statusRef = useRef()
    const experienceRef = useRef()
    const socialRef = useRef()

    useEffect(() => {
        if (phase === 3) addCreator()
    }, [creatorDetails.experience])

    const addCreator = async () => {
        const lala = await userService.addCreator(address, creatorDetails)
        console.log(lala)
        if (lala) navigate('/profile')
    }

    const completePhase1 = async (e) => {
        e.preventDefault()
        const uploadedImg = await uploadService.uploadImg(imgRef.current.files[0])
        setCreatorDetails({ ...creatorDetails, image: uploadedImg.secure_url, nickName: nameRef.current.value })
        setPhase(2)
    }
    const completePhase2 = (e) => {
        e.preventDefault()
        setCreatorDetails({
            ...creatorDetails, category: categoryRef.current.value, proficiencyGame: gameRef.current.value,
            region: regionRef.current.value, topAchievement: topAchivementRef.current.value
        })
        setPhase(3)
    }
    const completePhase3 = (e) => {
        e.preventDefault()
        setCreatorDetails({
            ...creatorDetails, status: statusRef.current.value, experience: experienceRef.current.value,
            socialLink: socialRef.current.value
        })

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
                <button>Continue <span className="material-symbols-outlined">arrow_forward</span></button>
            </form></>}
        {phase === 2 && <>
            <h1>Your Gaming Career</h1>
            <form className='phase2' onSubmit={completePhase2}>
                <div className='all-select-wrapper'>
                    <div className='h3-wrapper'>
                        <h3>Category</h3>
                        <div className='select-wrapper'>
                            <img src={require('../style/imgs/valorant-logo.png')} />
                            <select ref={categoryRef}>
                                <option value="gaming">Gaming</option>
                                <option value="sports">Sports</option>
                            </select>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='select-wrapper'>
                            <img src={require('../style/imgs/valorant-logo.png')} />
                            <select ref={gameRef}>
                                <option value="valorant">Valorant</option>
                                <option value="fifa">Fifa</option>
                            </select>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Region</h3>
                        <div className='select-wrapper'>
                            <img src={require('../style/imgs/valorant-logo.png')} />
                            <select ref={regionRef}>
                                <option value="europe">Europe</option>
                                <option value="asia">Asia</option>
                                <option value="south america">South america</option>
                                <option value="north america">North america</option>
                            </select>
                        </div>
                    </div>

                    <div className='h3-wrapper'>
                        <h3>Top achivement</h3>
                        <div className='select-wrapper'>
                            <img src={require('../style/imgs/valorant-logo.png')} />
                            <select ref={topAchivementRef}>
                                <option value="top10">Top 10</option>
                                <option value="top 100">Top 100</option>
                                <option value="top 500">Top 500</option>
                                <option value="1st">1st place</option>
                                <option value="2nd">2nd place</option>
                                <option value="3rd">3rd place</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button>Continue <span className="material-symbols-outlined">arrow_forward</span></button>
            </form>
        </>}
        {phase === 3 && <>
            <h1>Your Gaming Experience</h1>
            <form className='phase2' onSubmit={completePhase3}>
                    <div className='h3-wrapper'>
                        <h3>Status</h3>
                        <div className='select-wrapper'>
                            <img src={require('../style/imgs/valorant-logo.png')} />
                            <select ref={statusRef}>
                                <option value="gaming influencer">Gaming influencer</option>
                                <option value="streamer">Streamer</option>
                                <option value="pro player">Pro player</option>
                            </select>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Experience from</h3>
                        <div className='select-wrapper'>
                            <img src={require('../style/imgs/valorant-logo.png')} />
                            <select ref={experienceRef}>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                <input type="text" placeholder="link to social page" ref={socialRef} />
                <button>Create <span className="material-symbols-outlined">arrow_forward</span></button>
            </form>
        </>}
        <RegisterProgress phase={phase} />
    </section >
}