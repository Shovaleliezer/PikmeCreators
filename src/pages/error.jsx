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
        navigate('/')
        window.location.reload()
   }
    return (
        <div className='error'>
            <img src={require('../style/imgs/error.png')}/>
            <h1>sdfsdfsdffsgghkjhjmhgfgh</h1>
            <p>sdfsdfsdfsdffsdf</p>
            <div>contact</div>
            <div onClick={resetWebsite}>Reload page</div>
        </div>
    )
}