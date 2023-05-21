// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
// ChartJS.register(ArcElement, Tooltip, Legend);
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Doughnut } from 'react-chartjs-2'
import { setPopup } from '../store/actions/general.actions'
var arrayOfStrings = ["FF8447", "FFC247", "FFFF47", "C2FF47", "84FF47", "47FF47", "47FF84", "47FFC2", "47FFFF", "47C2FF", "4784FF", "406EE5", "4747FF", "8447FF", "C247FF", "FF47FF", "FF47C2", "FF4784", "FF4747"];
var colors = arrayOfStrings.map(color => `rgb(${parseInt(color.slice(0, 2), 16)}, ${parseInt(color.slice(2, 4), 16)}, ${parseInt(color.slice(4, 6), 16)})`);
const options = { plugins: { legend: { display: false } } }

export function PopupStats({ stats }) {
    const dispatch = useDispatch()
    const { players, totalTickets, totalViewers, game } = stats
    const [isMoney, setIsMoney] = useState(true)
    const names = []
    const money = []
    const viewers = []

    for (var key in players) {
        names.push(players[key].nickName)
        money.push(players[key].amount)
        viewers.push(players[key].viewers)
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
        <div className='analytics'>
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
                <div className='chart'><Doughnut data={data} options={options} /></div>
                <div className='data'>
                    {names.map((name, idx) => <div className='player' key={idx}>
                        <div style={{background:colors[idx]}}/>
                        <p>{name}</p>
                        <p>{isMoney ? money[idx] : viewers[idx]}</p>
                        
                        

                    </div>)}
                </div>
            </div>
            <div className="done" onClick={() => dispatch(setPopup(''))}>Done</div>



        </div>
    </>)
}