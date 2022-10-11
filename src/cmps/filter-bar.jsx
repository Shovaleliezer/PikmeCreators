import { isMobile } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from '../store/actions/general.actions'
export function FilterBar({ mode }) {

    const showArrows = isMobile ? 'none' : 'block'
    const dispatch = useDispatch()
    const { filter } = useSelector((storeState) => storeState.generalModule)

    const clickFilter = (clickedFilter) => {
        if (filter.name === clickedFilter.name) dispatch(setFilter(''))
        else dispatch(setFilter(clickedFilter))
    }

    const scroll = (val) => {
        if (isMobile) return
        const filterBar = document.querySelector('.filter-bar')
        filterBar.scrollBy({ left: val, behavior: 'smooth' })
    }

    let isScroll = isMobile ? 'scroll' : 'hidden'
    const filters= [
        {name:'get rewards',shareWithCommunity:true},
        {name:'sports' ,search:'sport'},
        {name:'gaming', search:'gaming'},
        {name:'fortnite',search:'fortnite'},
        {name:'fifa',search:'fifa'},
        {name:'basketball',search:'basketball'},
        {name:'valorant',search:'valorant'},
        {name:'footballl',search:'football'},
        {name:'counter strike',search:'counter strike'},
        {name:'tennis',search:'tennis'},
        {name:'league of legends',search:'league of legends'},
        {name:'table tennis',search:'table tennis'},
        {name:'cod-warzone',search:'warzone'},
        {name:'hockey',search:'hockey'},
        {name:'apex legends',search:'apex legends'},
        {name:'golf',search:'golf'},
        {name:'dota 2',search:'dota 2'},
        {name:'boxing',search:'boxing'},
        {name:'pubg',search:'pubg'},
        {name:'overwatch',search:'overwatch'},
        {name:'rocket league',search:'rocket league'},
    ]
    return (
        <div className='wrapper'>
            <div className={`filter-bar ${mode.type} noselect`} style={{ overflowX: isScroll }}>
                <div style={{ display: showArrows, right: '10px' }} className={`${mode.type} filter-nav clickable`}><span className="material-symbols-outlined" onClick={() => scroll(window.innerWidth * 0.75)}>chevron_right</span></div>
                <div style={{ display: showArrows, left: '10px' }} className={`${mode.type} filter-nav clickable`}><span className="material-symbols-outlined" onClick={() => scroll(-window.innerWidth * 0.75)}>chevron_left</span></div>
                {filters.map(search => {
                    return <div style={{ background: filter.name === search.name ? '#F29B00' : '' }} className="clickable hover-main"
                     key={search.name} onClick={() => clickFilter(search)}>{search.name.toLocaleUpperCase()}</div>
                })}
            </div>
        </div>

    )
}
