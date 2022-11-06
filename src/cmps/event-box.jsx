import Timer from "./timer"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setPopup, setPopupBought } from "../store/actions/general.actions"

import { getDateName, formatHour, makeCommas } from "../services/utils"
import { ERC20TransferABI } from "../abi"
import Web3 from 'web3';

export function EventBox({ ev }) {
    const { ethereum } = window;
    const web3 = new Web3(ethereum);
    const daiToken = new web3.eth.Contract(ERC20TransferABI, "0x16780a9ecDF08ec74c0aE95a5425eE8e0C5ACCfa")
    const [tickets, setTickets] = useState(1)
    const [chosen, setChosen] = useState('teamOne')
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    let isNarrow = window.innerWidth < 1400 ? true : false
    let mainImg = 'sport'
    const gasLimit = 105000;
    if (ev.category !== 'sport') mainImg = ev.game

    const getRatios = (redTickets, blueTickets) => {
        const all = redTickets + blueTickets
        const redPrecent = Math.floor((redTickets / all) * 100) + 1
        const bluePrecent = Math.floor((blueTickets / all) * 100)
        const team1ratio = (all / redTickets).toString().slice(0, 4)
        const team2ratio = (all / blueTickets).toString().slice(0, 4)
        return { redPrecent, bluePrecent, team1ratio, team2ratio }
    }

    const onInputClick = (e) => {
        if (e.target.value >= 0 && e.target.value <= 9999) setTickets(Number(e.target.value))
    }
    const onButtonClick = (value) => {
        if (Number(tickets + value) >= 1 && Number(tickets + value) <= 9999) setTickets(Number(tickets + value))
    }
    const buyTickets = async (e) => {
        // var confirmNumber = Math.floor(Math.random() * 1000000)
        // if (!user.isConnected) {
        //     dispatch(setPopup('connect'))
        //     return
        // }
        // if (tickets <= 0) return
        // console.log("test ", await daiToken.methods.confirmCode(user.address).call())
        // const price = await daiToken.methods.PRICE_PER_TOKEN().call()
        // const tx_dict={
        //     nonce: await web3.eth.getTransactionCount(user.address),
        //     from: user.address,
        //     gasPrice: web3.utils.toHex(String(gasLimit*tickets)*50000),
        //     gasLimit: web3.utils.toHex(String(gasLimit*tickets)),
        //     value: web3.utils.toHex(price),
        //     chainId: 56,
        //       };
        // await daiToken.methods.buyTicket(tickets, confirmNumber).send(tx_dict)
        // .once("error", async (err) => {
        //     //something went wrong
        //   })
        //   .then( async (receipt) => {
        //     if (receipt.blockNumber){
        //         const eventt = await eventService.sellTickets(ev._id, { tickets, chosen, buyerAddress: user.address, confirmNumber })
        //         if (eventt) dispatch(setPopup('bought'))
        //     }

        //   });
        console.log(ev)
        dispatch(setPopupBought({
            player1: ev.teamOneName,
            player2: ev.teamTwoName,
            tickets,
            date: ev.date,
        }))
        dispatch(setPopup('bought'))
    }

    const ratios = getRatios(527, 931)
    return (
        <div>
            <div className='event-box' >
                <section className="event-details">
                    {isNarrow ? <div className="event-img-wrapper">
                        <img className="event-img" src={require(`../style/imgs/games-icons/${mainImg}-big.png`)} />
                    </div> :
                        <img className="event-img" src={require(`../style/imgs/games-icons/${mainImg}-big.png`)} />}
                    <div className="timer-holder">
                        <p>Match Live in :</p>
                        <Timer eventDate={new Date(ev.date)} />
                    </div>
                    <div className="pricepool-holder">
                        <div>
                            <img className="coins" src={require('../style/imgs/coins.png')} />
                            <p className="total-pricepool">34K</p>
                        </div>
                        <div>
                            <img className="sand-watch" src={require('../style/imgs/sand-watch.png')} />
                            <div className="date-holder">
                                <p>{getDateName(ev.date)}</p>
                                <p>{formatHour(ev.date)} GMT</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="event-distribution">
                    <h2>Bet Distribution</h2>
                    <div className="bar-wrapper">
                        <p>{ratios.redPrecent}%</p>
                        <div className="distribution-bar">
                            <div style={{ width: `${ratios.redPrecent}%` }} className="team-red"></div>
                            <div style={{ width: `${ratios.bluePrecent}%` }} className="team-blue"></div>
                        </div>
                        <p>{ratios.bluePrecent}%</p>
                    </div>
                </section>
                {isNarrow && <img src={require('../style/imgs/choose.png')} className='choose' />}
                <section className="event-teams">
                    <div className={`team-1-holder clickable ${chosen === 'teamOne' ? 'border-main team1-glow' : ''}`}
                        onClick={() => setChosen('teamOne')}
                        style={{ borderColor: chosen === 'teamOne' ? '$main' : '' }}>
                        <div>
                            <img className="team-icon" src={ev.teamOneIcon} />
                            <p>{ev.teamOneName}</p>
                        </div>
                        <h2>{ratios.team1ratio}</h2>

                    </div>

                    {!isNarrow && <img src={require('../style/imgs/choose.png')} className='choose' />}

                    <div className={`team-2-holder clickable ${chosen === 'teamTwo' ? 'border-main team2-glow' : ''}`}
                        onClick={() => setChosen('teamTwo')}>
                        <h2>{ratios.team2ratio}</h2>
                        <div>
                            <p>{ev.teamTwoName}</p>
                            <img className="team-icon" src={ev.teamTwoIcon} />
                        </div>
                    </div>
                </section>
            </div>
            <section className="buy-tickets">
                <div className="edit">
                    <div className="noselect" onClick={() => onButtonClick(-1)}><span className="material-symbols-outlined">remove</span></div>


                    <input type='number' value={tickets} step={1} onChange={onInputClick} />
                    <div className="noselect" onClick={() => onButtonClick(1)}>+</div>
                </div>
                <div className='pay' onClick={buyTickets}><p>Buy tickets </p><p className="tickets-price">{makeCommas(tickets * 5)}$</p></div>
            </section>
        </div>
    )
}