export function RegisterProgress({ phase }) {
    return (<div className='progress'>
        <div className='main-progress'>
            <div className="back-main">{phase > 1 ? <span className="material-symbols-outlined">done</span> : 1}</div>
            <p>Choose your name</p>
        </div>
        <div className='mid-progress'>
            <div className={phase > 1 ? 'back-main' : ''}></div>
            <p>e</p>
        </div>
        <div className='main-progress'>
            <div className={phase > 1 ? 'back-main' : ''}>{phase > 2 ? <span className="material-symbols-outlined">done</span> : 2}</div>
            <p>Gaming career</p>
        </div>
        <div className='mid-progress'>
            <div className={phase > 2 ? 'back-main' : ''}></div>
            <p>e</p>
        </div>
        <div className='main-progress'>
            <div className={phase > 2 ? 'back-main' : ''}>3</div>
            <p>Gaming experience</p>
        </div>
    </div>)
}