import { isMobile } from 'react-device-detect'
import { useDispatch,useSelector } from 'react-redux'
import { setFilter } from '../store/actions/general.actions'
export function FilterBar({ mode }) {

    const showArrows = isMobile ? 'none' : 'block'
    const dispatch = useDispatch()
    const { filter } = useSelector((storeState) => storeState.generalModule)

    const clickFilter = (searchWord) => {
        if(filter===searchWord) dispatch(setFilter(''))
        else dispatch(setFilter(searchWord))
    }

    const scroll = (val) => {
        if (isMobile) return
        const filterBar = document.querySelector('.filter-bar')
        filterBar.scrollBy({ left: val, behavior: 'smooth' })
    }

    let isScroll = isMobile ? 'scroll' : 'hidden'
    const filters = ['fifa', 'valorant', 'cosmin', 'rocket league', 'zel22', 'CS GO', 'tenz', 'steve', 'streamer11111', 'streamer2',
        'league of legends', 'dota 2', 'fireborn', 'eldris', 'elden ring', 'game1', 'game2', 'game3', 'overwatch', 'call of duty', 'minecraft', 'gta5', 'need for speed', 'god of war']

    return (
        <div className='wrapper'>
            <div className={`filter-bar ${mode.type} noselect`} style={{ overflowX: isScroll }}>
                <div style={{ display: showArrows, right: '10px' }} className={`${mode.type} filter-nav clickable`}><span className="material-symbols-outlined" onClick={() => scroll(window.innerWidth * 0.75)}>chevron_right</span></div>
                <div style={{ display: showArrows, left: '10px' }} className={`${mode.type} filter-nav clickable`}><span className="material-symbols-outlined" onClick={() => scroll(-window.innerWidth * 0.75)}>chevron_left</span></div>
                {filters.map(search =>{
                    return <div style={{background: filter===search? '#F29B00':''}} className="clickable hover-main" key={search} onClick={() => clickFilter(search)}>{search.toLocaleUpperCase()}</div>
                })} 
            </div>
        </div>

    )
}
