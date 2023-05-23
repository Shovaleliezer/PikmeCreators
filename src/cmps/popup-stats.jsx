import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { setPopup } from '../store/actions/general.actions'
ChartJS.register(ArcElement, Tooltip, Legend)
var arrayOfStrings = ["FF8447", "FFC247", "FFFF47", "C2FF47", "84FF47", "47FF47", "47FF84", "47FFC2", "47FFFF", "47C2FF", "4784FF", "406EE5", "4747FF", "8447FF", "C247FF", "FF47FF", "F40084", "FF47C2", "FF4784", "FF4747"];
var colors = arrayOfStrings.map(color => `rgb(${parseInt(color.slice(0, 2), 16)}, ${parseInt(color.slice(2, 4), 16)}, ${parseInt(color.slice(4, 6), 16)})`)
const options = { plugins: { legend: { display: false } } }

const get20players = () => {
    const players = []
    for (let i = 0; i < 19; i++) {
        players.push({
            amount: 12.05, percentage: 30,
            viewers: 47, percentageViewers: 12, nickName: 'billboobeg13'
        })
    }
    return players
}

export function PopupStats({ stats }) {
    const dispatch = useDispatch()
    const { totalTickets, totalViewers, game } = stats
    const players = get20players()
    const [isMoney, setIsMoney] = useState(true)
    const names = []
    const money = []
    const viewers = []
    const percentMoney = []
    const percentViewers = []

    for (var key in players) {
        names.push(players[key].nickName)
        money.push(players[key].amount)
        viewers.push(players[key].viewers)
        percentMoney.push(players[key].percentage)
        percentViewers.push(players[key].percentageViewers)
    }

    const data = {
        labels: names,
        datasets: [
            {
                label: isMoney ? 'BNB' : 'viewers',
                data: isMoney ? money : viewers,
                backgroundColor: colors,
                borderWidth: 0,
            },
        ],
    }

    if (stats === 'no-tickets') return (<>
        <h1>no tickets</h1>
    </>)

    return (<>
        <div className='analytics too-low-fix'>
            <div className='upper'>
                <img src={require('../style/imgs/create-stream.png')} style={{ cursor: 'auto' }} />
                <h1>{game}</h1>
                <img className='clickable' src={require('../style/imgs/close-icon.png')} onClick={() => dispatch(setPopup(''))} />
            </div>
            <div className='display'>
                <div className={isMoney ? 'active' : 'inactive'} onClick={() => setIsMoney(true)}>
                    <p>{totalTickets}</p>
                    <img src={require(`../style/imgs/analytics/${isMoney ? 'bnb-selected' : 'bnb'}.png`)} />
                </div>
                <div className={!isMoney ? 'active' : 'inactive'} onClick={() => setIsMoney(false)}>
                    <p>{totalViewers}</p>
                    <img src={require(`../style/imgs/analytics/${!isMoney ? 'viewers-selected' : 'viewers'}.png`)} />
                </div>
            </div>
            <div className='details'>
                <div className='chart'>
                    <p>{isMoney ? totalTickets : totalViewers}</p>
                    <Doughnut data={data} options={options} />
                </div>
                <div className='data'>
                    <div>
                        {names.map((name, idx) => <div key={idx}>
                            <div style={{ background: colors[idx] }} className='circle' />
                            <p>{name}</p>
                        </div>)}
                    </div>
                    {isMoney && <>
                        <div className='amounts'>
                            {money.map((m, idx) => <div key={idx}>
                                <p>{m}</p>
                                <img src={require('../style/imgs/analytics/bnb-selected.png')} />
                            </div>)}
                        </div>
                        <div className='amounts'>
                            {percentMoney.map((mp, idx) => <div key={idx}>
                                <p>{mp}%</p>
                            </div>)}
                        </div>

                    </>}
                    {!isMoney && <>
                        <div className='amounts'>
                            {viewers.map((v, idx) => <div key={idx}>
                                <p>{v}</p>
                                <img src={require('../style/imgs/analytics/viewers-selected.png')} />
                            </div>)}
                        </div>
                        <div className='amounts'>
                            {percentViewers.map((vp, idx) => <div key={idx}>
                                <p>{vp}%</p>
                            </div>)}
                        </div>
                    </>}
                </div>
            </div>
            <div className="done" onClick={() => dispatch(setPopup(''))}>Done</div>
        </div>
    </>)
}