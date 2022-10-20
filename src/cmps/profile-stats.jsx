import { makeCommas } from '../services/utils'

export function ProfileStats({ stats }) {
    let rankColor
    switch (stats.rank) {
        case 'unranked':
            rankColor = '#737d81'
            break
        case 'bronze':
            rankColor = '#e5ae7c'
            break
        case 'silver':
            rankColor = '#c2d1dd'
            break
        case 'gold':
            rankColor = '#ffc100'
            break
        case 'diamond':
            rankColor = '#46c4ff'
            break
    }
    let category = 'gaming'
    let sports = ['soccer', 'basketball', 'hockey', 'football', 'tennis', 'table tennis', 'boxing', 'golf']
    if (sports.some(sp => sp === stats.favGame)) category = 'sport'

    return (
            <section className="profile-stats">
            <div>
                <img src={require('../style/imgs/gold-cup.png')} />
                <h2>Games won:</h2>
                <h2 className='main-color'>{makeCommas(stats.gamesWon)}</h2>
            </div>
            <div>
                <img src={require(`../style/imgs/categories/${category}.png`)} />
                <h2>Favorite category:</h2>
                <h2 className='main-color'>{stats.favGame}</h2>
            </div>
            <div>
                <img src={require(`../style/imgs/rank/${stats.rank}.png`)} />
                <h2>Current rank:</h2>
                <h2 style={{ color: rankColor }}>{stats.rank}</h2>
            </div>
        </section> 
    )
}