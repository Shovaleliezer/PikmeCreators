import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { uploadFile } from '../services/upload.service.js'
import { RegisterProgress } from './register-progress.jsx'
import { getYears } from '../services/utils.js'
import { setCreator, setAddress, setIsConnected, setPhone } from '../store/reducers/userReducer.js'
import { setCallbackLink, setUpperPopup } from '../store/actions/general.actions.js'
import { setRegisterPhase } from '../store/actions/tutorial.actions.js'
import { userService } from '../services/user.service'
import { games } from '../services/data.service.js'

export function Register() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { phone } = useSelector((state) => state.user)
    const { callbackLink } = useSelector((state) => state.generalModule)
    const { linkId } = useSelector((state) => state.generalModule)

    const [phase, setPhase] = useState(1)
    const [creatorDetails, setCreatorDetails] = useState({
        nickName: '',
        walletAddress: '',
        image: '',
        category: '',
        proficiencyGame: '',
        region: '',
        topAchievement: '',
        status: '',
        experience: '',
        socialLink: ''
    })
    const [img, setImg] = useState({ category: 'gaming', game: 'choose' })
    const [category, setCategory] = useState('sports')
    const [isLoader, setIsLoader] = useState(false)
    const [file, setFile] = useState(null)
    const [sent, setSent] = useState(false)

    const years = getYears()
    const nameRef = useRef()
    const addressRef = useRef()
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
        try {
            setSent(true)
            const newCreator = await userService.editCreator(phone, { ...creatorDetails, linkId: linkId || 'no-link' })
            dispatch(setCreator(newCreator))
            dispatch(setIsConnected(true))
            dispatch(setCreator(newCreator))
            dispatch(setAddress(newCreator.walletAddress))
            dispatch(setPhone(newCreator.phone))

            if (callbackLink) {
                navigate(callbackLink)
                dispatch(setCallbackLink(''))
            }
            else {
                dispatch(setRegisterPhase(1))
                window.location.reload()
            }
        }

        catch (err) {
            navigate('/')
        }
    }

    const completePhase1 = async (e) => {
        e.preventDefault()
        setIsLoader(true)
        const eth = new RegExp(/^0x[a-fA-F0-9]{40}$/)
        if (!eth.test(addressRef.current.value)) {
            dispatch(setUpperPopup('invalidAddress'))
            setIsLoader(false)
            return
        }
        try {
            const isTaken = await userService.isAddressValid(addressRef.current.value)
            if (isTaken) {
                dispatch(setUpperPopup('takenAddress'))
                setIsLoader(false)
                return
            }
            const uploadedImg = await uploadFile(imgRef.current.files[0])
            setCreatorDetails({ ...creatorDetails, image: uploadedImg.secure_url, nickName: nameRef.current.value, walletAddress: addressRef.current.value })
            setPhase(2)
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const completePhase2 = (e) => {
        e.preventDefault()
        const opt = [categoryRef.current.value, gameRef.current.value, regionRef.current.value, topAchivementRef.current.value]
        if (opt.some(val => val === 'choose')) {
            dispatch(setUpperPopup('choose'))
            return
        }

        setCreatorDetails({
            ...creatorDetails, category: categoryRef.current.value, proficiencyGame: gameRef.current.value,
            region: regionRef.current.value, topAchievement: topAchivementRef.current.value
        })
        setPhase(3)
    }

    const completePhase3 = (e) => {
        e.preventDefault()
        let link = socialRef.current.value
        if (link !== '') {
            let url = ''
            try {
                url = new URL(link)
                if (link.includes('instagram') || link.includes('twitter') || link.includes('tiktok') || link.includes('youtube')) link = url.href
                else {
                    dispatch(setUpperPopup('socialUnsupported'))
                    socialRef.current.value = ''
                    return
                }
            } catch {
                dispatch(setUpperPopup('socialError'))
                socialRef.current.value = ''
                return
            }
        }
        if (statusRef.current.value === 'choose' || experienceRef.current.value === 'choose') {
            dispatch(setUpperPopup('choose'))
            return
        }

        setCreatorDetails({
            ...creatorDetails, status: statusRef.current.value, experience: experienceRef.current.value,
            socialLink: link
        })
    }

    const handleImg = (e) => {
        const { name, value } = e.target
        if (name === 'category') {
            if (value === 'gaming') setImg({ category: 'gaming', game: 'valorant' })
            else if (value === 'choose') setImg({ category: 'choose', game: 'choose' })
            else setImg({ category: 'sports', game: 'table-tennis' })
            setCategory(value)
        }
        else setImg({ ...img, [name]: value })
    }

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    if (sent) return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div></div>

    return <section className="register">
        {phase === 1 && <>
            <h1>personal info</h1>
            <form className='phase1' onSubmit={completePhase1}>
                <h3>Nickname</h3>
                <input type="text" placeholder="Enter your nickname" required maxLength={15} ref={nameRef} />
                <h3>Wallet address</h3>
                <input type="text" placeholder="Ethereum wallet address" required ref={addressRef} />
                <h3>Profile Image</h3>
                <label htmlFor='img'><div className="upload-img"><img src={require('../style/imgs/img-upload.png')} />{file && file.name}</div></label>
                <input id='img' className="non-appear" type="file" placeholder="Upload your image" accept="image/*" required ref={imgRef} onChange={handleFile} />
                {isLoader && <div className="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
                <button>Continue <span className="material-symbols-outlined">arrow_forward</span></button>
            </form></>}
        {phase === 2 && <>
            <h1>Your Gaming Career</h1>
            <form className='phase2' onSubmit={completePhase2}>
                <div className='all-select-wrapper'>
                    <div className='h3-wrapper'>
                        <h3>Category</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${img.category}.png`)} />
                            <select ref={categoryRef} onClick={handleImg} name='category' disabled>
                                <option value="sports">Sports</option>
                                <option value="gaming">Gaming</option>
                                <option value='choose'>Choose</option>
                            </select>
                        </div>
                    </div>
                    {category === 'gaming' && <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${img.game}.webp`)} />
                            <select ref={gameRef} onClick={handleImg} name='game' >
                                <option value="choose">Choose</option>
                                <option value="valorant">Valorant</option>
                                <option value="fifa">Fifa</option>
                            </select>
                        </div>
                    </div>}
                    {category === 'sports' && <div className='h3-wrapper'>
                        <h3>sport type</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${img.game}.webp`)} />
                            <select ref={gameRef} onClick={handleImg} name='game'>
                                <option value="choose">Choose</option>
                                {games.map(g => <option value={g.game}>{g.display}</option>)}
                            </select>
                        </div>
                    </div>}
                    {category === 'choose' && <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/choose.webp`)} />
                            <select ref={gameRef} onClick={handleImg} name='game' style={{ opacity: (!gameRef.current || gameRef.current.value === 'choose') ? 0.7 : 1 }}>
                                <option value="choose">Choose</option>
                            </select>
                        </div>
                    </div>}
                    <div className='h3-wrapper'>
                        <h3>Region</h3>
                        <div className='select-wrapper'>
                            <img src={require('../style/imgs/register/region.png')} />
                            <select ref={regionRef} >
                                <option value="choose">Choose</option>
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
                            <img src={require('../style/imgs/register/achievement.png')} />
                            <select ref={topAchivementRef}>
                                <option value="choose">Choose</option>
                                <option value="skilled player">Skilled player</option>
                                <option value="local champion">Local champion</option>
                                <option value="highest rank">Highest rank</option>
                                <option value="coach">Coach</option>
                                <option value="top 500">Top 500 </option>
                                <option value="1st in region">1st in region</option>
                                <option value="top 10 in region">Top 10 region</option>
                                <option value="top 100 in region">Top 100 region</option>
                                <option value="1st in country">1st in country</option>
                                <option value="top 10 in country">Top 10 country</option>
                                <option value="top 100 in country">Top 100 country</option>
                                <option value="top 10 world">Top 10 world</option>
                                <option value="top 100 world">Top 100 world</option>
                                <option value="1st in the world">1st in the world</option>
                                <option value="2nd in the world">2nd in the world</option>
                                <option value="3rd in the world">3rd in the world</option>
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
                        <select ref={statusRef}>
                            <option value="choose">Choose</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermidate">Intermidate</option>
                            <option value="advanced">Advanced</option>
                            <option value="pro">Pro</option>
                        </select>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Experience from</h3>
                    <div className='select-wrapper'>
                        <select ref={experienceRef}>
                            <option value="choose">Choose</option>
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Link to social page</h3>
                    <input type="text" placeholder="Optional" ref={socialRef} style={{ marginTop: '0', width: '100%' }} />
                </div>
                <button>Create <span className="material-symbols-outlined">arrow_forward</span></button>
            </form>
        </>}
        <RegisterProgress phase={phase} />
    </section >
}