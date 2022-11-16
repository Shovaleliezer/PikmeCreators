import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { getYears } from "../services/utils"

export function Profile() {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const [img, setImg] = useState({ category: 'gaming', game: 'valorant' })
    const [selectedCategory, setSelectedCategory] = useState('gaming')
    const [isLoader, setIsLoader] = useState(false)

    const years = getYears()

    if (!user || !user.creator) {
        navigate('/')
        return <></>
    }

    const copy = () => {
        navigator.clipboard.writeText(user.address)
    }

    const handleImg = (e) => {
        const { name, value } = e.target
        if (name === 'category') {
            if (value === 'gaming') setImg({ category: 'gaming', game: 'valorant' })
            else setImg({ category: 'sports', game: 'table-tennis' })
            setSelectedCategory(value)
        }
        else setImg({ ...img, [name]: value })
    }

    const { creator } = user
    const { nickName, walletAddress, image, category, proficiencyGame, region, topAchievement, status, experience, socialLink } = creator
    return <section className="profile">
        <h1>Profile</h1>
        <div className="edit-container">
            <div className="h3-wrapper">
                <h3>Wallet address</h3>
                <div className="second address"><span>{walletAddress.slice(0,4)+'...' + walletAddress.slice(-4)}</span><img onClick={copy} src={require('../style/imgs/register/address.png')} /></div>
            </div>
            <div className="h3-wrapper">
                <h3>Name</h3>
                <input className="second" type="text" placeholder="edit nickname" maxLength={15} />
            </div>
            <div className="main-img-wrapper">
                <label htmlFor='img'><img className="main-img" src={image} /></label>
                <input id='img' className="non-appear" type="file" accept="image/*" />
            </div>
            <div className='h3-wrapper'>
                <h3>Category</h3>
                <div className='img-wrapper second'>
                    <img src={require(`../style/imgs/register/${img.category}.png`)} />
                    <select onClick={handleImg} name='category'>
                        <option value="gaming">Gaming</option>
                        <option value="sports">Sports</option>
                    </select>
                </div>
            </div>
            {selectedCategory === 'gaming' ? <div className='h3-wrapper'>
                <h3>Game</h3>
                <div className='img-wrapper second'>
                    <img src={require(`../style/imgs/register/${img.game}.png`)} />
                    <select onClick={handleImg} name='game'>
                        <option value="valorant">Valorant</option>
                        <option value="fifa">Fifa</option>
                    </select>
                </div>
            </div> :
                <div className='h3-wrapper'>
                    <h3>sport type</h3>
                    <div className='img-wrapper second'>
                        <img src={require(`../style/imgs/register/${img.game}.png`)} />
                        <select onClick={handleImg} name='game'>
                            <option value="table-tennis">Table tennis</option>
                            <option value="poker">Poker</option>
                        </select>
                    </div>
                </div>}
            <div className='h3-wrapper'>
                <h3>Region</h3>
                <div className='img-wrapper second'>
                    <img src={require('../style/imgs/register/region.png')} />
                    <select >
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
                    <select >
                        <option value="top10">Top 10</option>
                        <option value="top 100">Top 100</option>
                        <option value="top 500">Top 500</option>
                        <option value="1st">1st place</option>
                        <option value="2nd">2nd place</option>
                        <option value="3rd">3rd place</option>
                    </select>
                </div>
            </div>
            <div className='h3-wrapper'>
                    <h3>Status</h3>
                    <div className='img-wrapper second'>
                        <select>
                            <option value="gaming influencer">Gaming influencer</option>
                            <option value="streamer">Streamer</option>
                            <option value="pro player">Pro player</option>
                        </select>
                    </div>
                </div>
                <div className='h3-wrapper'>
                    <h3>Experience from</h3>
                    <div className='img-wrapper second'>
                        <select >
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                </div>
        </div>
        <div className="save-wrapper"><button className="save">Continue <span className="material-symbols-outlined">arrow_forward</span></button></div>
    </section>
}