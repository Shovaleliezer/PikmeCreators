import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"

import { resetState } from "../store/reducers/userReducer"
import { resetGeneralState } from "../store/actions/general.actions"

export function Error() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const resetWebsite = () => {
        dispatch(resetState())
        dispatch(resetGeneralState())
        localStorage.removeItem('persist:root')
        navigate('/')
        window.location.reload()
   }
    return (
        <div className='error'>
            <img src={require('../style/imgs/error.png')}/>
            <h1>Website is unavailable!</h1>
            <p>Unfortunately the website is down at the moment. Try reloading the page,</p>
            <p>if the page is still unavailable contact our support team <span>here</span>.</p>
            <div onClick={resetWebsite}>Reload page</div>
        </div>
    )
}