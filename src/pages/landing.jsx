import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLinkId } from "../store/actions/general.actions"
import { useParams, useNavigate } from "react-router"

export function Landing() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { link } = useParams()
    const { linkId } = useSelector((state) => state.generalModule)

    useEffect(() => {
        handleLink()
    }, [])

    async function handleLink() {
        try {
            if (linkId) {
                navigate('/')
                return
            }
            const url = process.env.NODE_ENV === 'production' ? 'https://server.pikme.tv/handle-creator/update-link-clicked/' + link :
                'http://localhost:3030/handle-creator/update-link-clicked/' + link
            const res = await fetch(url)
            if (res) dispatch(setLinkId(link))
            navigate('/')
        }
        catch (err) {
            console.log(err)
            navigate('/')
        }
    }

    return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div></div></div>
}