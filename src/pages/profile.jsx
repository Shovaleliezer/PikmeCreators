import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { userService } from "../services/user.service"
import { games } from "../services/games.service"
import { uploadFile } from "../services/upload.service"
import { setCreator } from "../store/reducers/userReducer"
import { setUpperPopup } from "../store/actions/general.actions"
import { getYears } from "../services/utils"
import { Error } from "./error"

export function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [creator, setLocalCreator] = useState('loading')
    const [isOpen, setIsOpen] = useState(false)
    const [img, setImg] = useState('valorant')
    const [isChanged, setIsChanged] = useState(false)
    const [sent, setSent] = useState(false)
    const years = getYears()

    useEffect(() => {
        if (user) {
            loadCreator()
        }
        else {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [])

    const save = async () => {
        if (isChanged) {
            setSent(true)
            let link = creator.socialLink
            if (link !== '') {
                let url = ''
                try {
                    url = new URL(link)
                    if (link.includes('instagram') || link.includes('twitter') || link.includes('tiktok') || link.includes('youtube')) link = url.href
                    else {
                        dispatch(setUpperPopup('socialUnsupported'))
                        setSent(false)
                        return
                    }
                } catch (err) {
                    dispatch(setUpperPopup('socialError'))
                    setSent(false)
                    return
                }
            }
            const updatedCreator = await userService.editCreator(user.phone, { ...creator, socialLink: link })
            if (updatedCreator) {
                dispatch(setCreator(updatedCreator))
                navigate('/')
            }
        }
    }

    const loadCreator = async () => {
        try {
            const loadedCreator = await userService.addCreator(user.address, null)
            setLocalCreator(loadedCreator)
            setImg(loadedCreator.proficiencyGame)
        }
        catch {
            navigate('/')
        }
    }

    const copy = () => {
        navigator.clipboard.writeText(user.creator.walletAddress)
        dispatch(setUpperPopup('copied-address'))
    }

    const handleImg = (e) => {
        setImg(e.target.value)
        handleChange(e)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setLocalCreator({ ...creator, [name]: value })
        setIsChanged(true)
    }

    const handleChangeImage = async (e) => {
        const uploadedImg = await uploadFile(e.target.files[0])
        setLocalCreator({ ...creator, image: uploadedImg.secure_url })
        setIsChanged(true)
    }

    if (creator === 'loading' || sent) return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div></div>
    if (!creator) return <></>

    const { nickName, walletAddress, image, proficiencyGame, region, topAchievement, status, experience, socialLink } = creator
    
    try {
        return <><section className="profile">
            <h1>Account information</h1>
            <div className="edit-container">
                <div className="main-img-wrapper">
                    <label htmlFor='img' className="noselect"><img className="main-img" src={image} /></label>
                    <input id='img' className="non-appear" type="file" accept="image/*" onChange={handleChangeImage} />
                </div>
                <div className="h3-wrapper">
                    <h3>Wallet address</h3>
                    <div className="second address"><span>{walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)}</span><img onClick={copy} src={require('../style/imgs/register/address.png')} /></div>
                </div>
                <div className="h3-wrapper">
                    <h3>Name</h3>
                    <input className="second" name='nickName' type="text" placeholder="edit nickname" maxLength={15} value={nickName} onChange={handleChange} />
                </div>
                <div className='h3-wrapper'>
                    <h3>Main game</h3>
                    <div className='img-wrapper second'>
                        <img src={require(`../style/imgs/register/${img}.png`)} />
                        <select value={proficiencyGame} onChange={handleImg} name='proficiencyGame'>
                        {games.map(g => <option key={g.game} value={g.game}>{g.display}</option>)}
                        </select>
                    </div>
                </div>

                <div className='h3-wrapper'>
                    <h3>Region</h3>
                    <div className='img-wrapper second'>
                        <img src={require('../style/imgs/register/region.png')} />
                        <select name='region' value={region} onChange={handleChange}>
                            <option value="europe">Europe</option>
                            <option value="asia">Asia</option>
                            <option value="south america">South america</option>
                            <option value="north america">North america</option>
                        </select>
                    </div>
                </div>

                <div className='h3-wrapper'>
                    <h3>Top achivement</h3>
                    <div className='img-wrapper second'>
                        <img src={require('../style/imgs/register/achievement.png')} />
                        <select name="topAchievement" value={topAchievement} onChange={handleChange}>
                            <option value="1st">1st in the world</option>
                            <option value="2nd">2nd in the world</option>
                            <option value="3rd">3rd in the world</option>
                            <option value="top 10 world">Top 10 world</option>
                            <option value="top 100 world">Top 100 world</option>
                            <option value="1st region">1st in region</option>
                            <option value="top 10 region">Top 10 region</option>
                            <option value="top 100 region">Top 100 region</option>
                            <option value="1st country">1st in country</option>
                            <option value="top 10 country">Top 10 country</option>
                            <option value="top 100 country">Top 100 country</option>
                            <option value="top 500">Top 500 </option>
                            <option value="local champion">Local champion</option>
                            <option value="highest rank">Highest rank</option>
                            <option value="skilled player">Skilled player</option>
                            <option value="coach">Coach</option>
                        </select>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Status</h3>
                    <div className='img-wrapper second'>
                        <select name='status' value={status} onChange={handleChange}>
                            <option value="gaming influencer">Gaming influencer</option>
                            <option value="streamer">Streamer</option>
                            <option value="pro player">Pro player</option>
                        </select>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Experience from</h3>
                    <div className='img-wrapper second'>
                        <select name='experience' value={experience} onChange={handleChange}>
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                </div>
                <div className="h3-wrapper">
                    <h3>Social link</h3>
                    <input className="second social" name='socialLink' type="text" placeholder="enter social link" value={socialLink} onChange={handleChange} />
                </div>
            </div>
            <div className="save-wrapper">
                <button onClick={() => { isChanged ? setIsOpen(true) : navigate('/')}} className="back clickable">Back</button>
                <button onClick={save} className="save clickable">Save</button>
            </div>
        </section>
            {isOpen && <div className="simple-popup">
                <img src={require('../style/imgs/error.png')} />
                <h1>Are you sure</h1>
                <p>The changes you done will not be saved, go back anyway?</p>
                <div className='buttons-wrapper'>
                    <div className='bolder' onClick={() => setIsOpen(false)}>Cancel</div>
                    <div className='lighter' onClick={() => navigate('/')}>Back</div>
                </div>
            </div>}
        </>
    }
    catch {
        return <Error />
    }
}