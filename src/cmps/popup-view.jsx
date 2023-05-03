export function PopupView({ event, setPopup }) {

    return (<>
        <div className="screen blur" onClick={() => setPopup(false)}>
            {window.innerWidth < 700 && <div onClick={() => setPopup(false)} className="popup-close-mobile"><p>Tap to close</p></div>}
        </div>
        <section className='popup' style={{ zIndex: '1001' }}>
            <form className='create' >
                <div className='create-upper'>
                    <div></div>
                    <h1>Funding event</h1>
                    <img src={require('../style/imgs/close-icon.png')} onClick={() => { setPopup(false) }} />
                </div>
                <div className='all-select-wrapper'>
                    <div className='h3-wrapper'>
                        <h3>Category</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${event.category}.png`)} />
                            <div></div>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${event.game}.png`)} />

                        </div>
                    </div>
                    <div className='h3-wrapper date'>
                        <h3>Date</h3>
                        <div className='select-wrapper'>

                        </div>
                    </div>
                </div>
                <div className='all-select-wrapper'>
                    <div className='h3-wrapper'>
                        <h3>Game</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/${event.game}.png`)} />
                            <div></div>
                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Date</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/calendar.png`)} />

                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Target</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/target.png`)} />

                        </div>
                    </div>
                    <div className='h3-wrapper'>
                        <h3>Prize</h3>
                        <div className='select-wrapper'>
                            <img src={require(`../style/imgs/register/achievement.png`)} />

                        </div>
                    </div>
                    <div className='h3-wrapper' style={{ width: '100%' }}>
                        <h3>Description</h3>
                        <textarea name='description' readOnly={true} className='fund-desc' value={event.fund.description} />
                    </div>
                </div>
                <div className='center'>
                    <button>Confirm</button>
                </div>
            </form>
        </section>
    </>)
}