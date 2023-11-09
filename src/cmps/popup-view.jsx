import { formatDateHour } from '../services/utils'

export function PopupView({ event, setPopup, accept, reject }) {

    return (<>
        <div className="screen blur" onClick={() => setPopup(false)} />
        <section className='popup' style={{ zIndex: '1001', }}>
            <form className='create cr' style={{overflow:'auto'}}>
                <div className='create-upper' style={{ justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ width: '30px' }} />
                    <h1>Funding event</h1>
                    <img src={require('../style/imgs/close-icon.png')} onClick={() => { setPopup(false) }} />
                </div>
                <div className='confirm' style={{ minHeight: 'unset', paddingTop: '10px', width: '100%' }}>
                    <div className="boxes-wrapper" style={{ justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
                        <div className='h3-wrapper'>
                            <h3>Game</h3>
                            <div className='info-wrapper'>
                                <img src={require(`../style/imgs/register/${event.game}.webp`)} />
                                <p>{event.game}</p>
                            </div>
                        </div>
                        <div className='h3-wrapper'>
                            <h3>Date</h3>
                            <div className='info-wrapper'>
                                <img src={require(`../style/imgs/register/calendar.png`)} />
                                <p>{formatDateHour(event.date)}</p>
                            </div>
                        </div>
                        <div className='h3-wrapper'>
                            <h3>Target</h3>
                            <div className='info-wrapper'>
                                <img src={require(`../style/imgs/register/target.png`)} />
                                <p>{event.fund.target} BNB</p>
                            </div>
                        </div>
                        <div className='h3-wrapper' >
                            <h3>Prize</h3>
                            <div className='info-wrapper'>
                                <img src={require(`../style/imgs/register/achievement.png`)} />
                                <p>{event.fund.prize} BNB</p>
                            </div>
                        </div>
                        <div className='all-select-wrapper' style={{ maxWidth: window.innerWidth < 700 ? '300px' : '' }}>
                            <div className='h3-wrapper' style={{ width: '100%' }}>
                                <h3>Description</h3>
                                <textarea name='description' readOnly={true} className='fund-desc' value={event.fund.description} />
                            </div>
                        </div>
                    </div>
                    <div className='buttons-wrapper'>
                        <div className='lighter' onClick={() => reject(event._id)}>Reject</div>
                        <div className='bolder' onClick={() => accept(event)}>Accept</div>
                    </div>
                </div>

            </form>
        </section>
    </>)
}