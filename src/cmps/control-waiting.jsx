import { adminService } from "../services/admin.service"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { formatHour } from "../services/utils"
import { Error } from '../pages/error'
import { setPopup, setPopupPlayers, setPopupView } from "../store/actions/general.actions"

export function ControlWaiting() {
    const dispatch = useDispatch()
    const [waiting, setWaiting] = useState([])
    const [error, setError] = useState(false)

    useEffect(() => {
        loadWaiting()
    }, [])

    const loadWaiting = async () => {
        try {
            const waiting = await adminService.getWaitingEvents()
            setWaiting(waiting)
        }
        catch {
            setError(true)
        }
    }

    const formatDate = (date) => {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
        const d = new Date(date)
        return `${d.getDate()} ${monthNames[+date.slice(5, 7) - 1]} ${d.getFullYear()}, ${formatHour(date)}`
    }

    const openPopup = (ev) => {
        if (ev.fund) {
            dispatch(setPopupView(ev))
            dispatch(setPopup('view'))
        }
        else {
            dispatch(setPopupPlayers(ev.players))
            dispatch(setPopup('players'))
        }
    }

    if (error) return <Error />

    console.log(waiting)

    return (<>
        <div className="control-wrapper">
            <p className="list-count">Waiting events : <span>{waiting.length}</span></p>
            <div className="list">
                {waiting.map((ev, idx) => <div key={idx} className="event">
                    <div className="left">
                        <img className="game" src={require(`../style/imgs/${ev.game}-white.png`)} />
                        <div className="details">
                            <div className="top">
                                <img src={ev.players[0].image} />
                                <p>{ev.players[0].nickName}</p>
                                {ev.players.length > 1 && <>
                                    <p>+</p>
                                    <div className="img-wrapper">
                                        {ev.players.slice(1, 4).map((pl, idx) => <img key={idx} src={pl.image} className={`img${idx}`} />)}
                                    </div>
                                    <p>{ev.players.length - 1} players</p>
                                </>}
                            </div>
                            <p>{formatDate(ev.date)}</p>
                        </div>

                    </div>
                    <div className="right">
                        <div onClick={() => openPopup(ev)}>
                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M26.7049 14.745C25.8228 12.4632 24.2914 10.49 22.3 9.06906C20.3086 7.64817 17.9445 6.84193 15.4999 6.75C13.0553 6.84193 10.6912 7.64817 8.69983 9.06906C6.70844 10.49 5.17705 12.4632 4.29493 14.745C4.23535 14.9098 4.23535 15.0902 4.29493 15.255C5.17705 17.5368 6.70844 19.51 8.69983 20.9309C10.6912 22.3518 13.0553 23.1581 15.4999 23.25C17.9445 23.1581 20.3086 22.3518 22.3 20.9309C24.2914 19.51 25.8228 17.5368 26.7049 15.255C26.7645 15.0902 26.7645 14.9098 26.7049 14.745V14.745ZM15.4999 21.75C11.5249 21.75 7.32492 18.8025 5.80242 15C7.32492 11.1975 11.5249 8.25 15.4999 8.25C19.4749 8.25 23.6749 11.1975 25.1974 15C23.6749 18.8025 19.4749 21.75 15.4999 21.75Z" fill="white" />
                                <path d="M15.5 10.5C14.61 10.5 13.74 10.7639 12.9999 11.2584C12.2599 11.7529 11.6831 12.4557 11.3425 13.2779C11.0019 14.1002 10.9128 15.005 11.0865 15.8779C11.2601 16.7508 11.6887 17.5526 12.318 18.182C12.9474 18.8113 13.7492 19.2399 14.6221 19.4135C15.495 19.5872 16.3998 19.4981 17.2221 19.1575C18.0443 18.8169 18.7471 18.2401 19.2416 17.5001C19.7361 16.76 20 15.89 20 15C20 13.8065 19.5259 12.6619 18.682 11.818C17.8381 10.9741 16.6935 10.5 15.5 10.5ZM15.5 18C14.9067 18 14.3266 17.8241 13.8333 17.4944C13.3399 17.1648 12.9554 16.6962 12.7284 16.1481C12.5013 15.5999 12.4419 14.9967 12.5576 14.4147C12.6734 13.8328 12.9591 13.2982 13.3787 12.8787C13.7982 12.4591 14.3328 12.1734 14.9147 12.0576C15.4967 11.9419 16.0999 12.0013 16.6481 12.2284C17.1962 12.4554 17.6648 12.8399 17.9944 13.3333C18.3241 13.8266 18.5 14.4067 18.5 15C18.5 15.7956 18.1839 16.5587 17.6213 17.1213C17.0587 17.6839 16.2957 18 15.5 18Z" fill="white" />
                            </svg>
                            <p>view</p>
                        </div>
                        <div>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24.5786 22.5581C24.8469 22.8263 24.9976 23.1902 24.9976 23.5696C24.9976 23.9489 24.8469 24.3128 24.5786 24.581C24.3104 24.8493 23.9465 25 23.5671 25C23.1877 25 22.8238 24.8493 22.5556 24.581L15 17.0235L7.44206 24.5787C7.17378 24.8469 6.80992 24.9976 6.43052 24.9976C6.05113 24.9976 5.68727 24.8469 5.41899 24.5787C5.15072 24.3104 5 23.9466 5 23.5672C5 23.1878 5.15072 22.824 5.41899 22.5557L12.9769 15.0006L5.42137 7.4431C5.1531 7.17484 5.00238 6.81101 5.00238 6.43163C5.00238 6.05225 5.1531 5.68842 5.42137 5.42016C5.68965 5.1519 6.05351 5.00119 6.4329 5.00119C6.8123 5.00119 7.17616 5.1519 7.44444 5.42016L15 12.9776L22.5579 5.41897C22.8262 5.15071 23.1901 5 23.5695 5C23.9489 5 24.3127 5.15071 24.581 5.41897C24.8493 5.68723 25 6.05106 25 6.43044C25 6.80982 24.8493 7.17365 24.581 7.44191L17.0231 15.0006L24.5786 22.5581Z" fill="white" />
                            </svg>
                            <p>reject</p>
                        </div>
                        <div>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M25.6704 5.30229C25.8671 5.51051 25.9852 5.80174 25.9987 6.11195C26.0122 6.42215 25.92 6.72594 25.7424 6.95653L13.0752 23.3584L12.3852 24.25L11.6432 23.4194L4.30911 15.2184C4.11736 15.0037 4.00626 14.7085 4.00026 14.3979C3.99426 14.0872 4.09384 13.7865 4.27711 13.5618C4.46038 13.3372 4.71231 13.207 4.97749 13.2C5.24267 13.1929 5.49937 13.3096 5.69113 13.5243L12.2812 20.8935L24.2584 5.38547C24.3465 5.27133 24.453 5.17867 24.5717 5.11278C24.6905 5.04689 24.8191 5.00905 24.9504 5.00144C25.0816 4.99382 25.2128 5.01657 25.3365 5.06839C25.4602 5.12022 25.574 5.20009 25.6714 5.30346L25.6704 5.30229Z" fill="white" />
                            </svg>
                            <p>accept</p>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    </>)
}