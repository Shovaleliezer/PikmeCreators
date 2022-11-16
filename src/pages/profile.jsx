import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

export function Profile() {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    if (!user || !user.creator) {
        navigate('/')
        return <></>
    }

    const { creator } = user
    return <h1>welcome {creator.nickName}</h1>
}