export function ProfileStats({ stats }) {
    let rankColor
    console.log(stats)
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

    return (
        <section className="profile-stats">
            <div>
                <img src={require('../style/imgs/gold-cup.png')} />
                <h2>Games won:</h2>
                <h2 className='main-color'>{stats.gamesWon}</h2>
            </div>
            <div>
                <img src={require('../style/imgs/soccer.png')} />
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