import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPopup } from "../store/actions/general.actions"

export function PopupVideo({ video }) {
    const dispatch = useDispatch()

    useEffect(() => {
        document.documentElement.style.setProperty('--visibility', 'hidden')
        return () => document.documentElement.style.setProperty('--visibility', 'visible')
    }, [])

    return <div className='popup-video'>
        <iframe
            src={video.slice(0, 4) + 's' + video.slice(4)}
            width="100%"
            height="100%"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowfullscreen
            frameborder="0"
        />
    </div>
}
