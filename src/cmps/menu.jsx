import { useSelector,useDispatch } from "react-redux"
import { toggleMode } from "../store/actions/general.actions"
import { setMenu } from "../store/actions/general.actions"

export function Menu(props) {
    const dispatch = useDispatch()
    const { menu } = useSelector((storeState) => storeState.generalModule)
    let color = props.mode.type==='light'? '#1b1e1f' : '#f5f5f5'

    switch (menu) {
        case '':
            return <></>
        case 'normal':
            return <>
            <div className="screen" onClick={()=>dispatch(setMenu(''))}></div>
            <section className={`menu ${props.mode.type} noselect`}>
                <div><div><span className="material-symbols-outlined">history</span></div> <div>History</div></div>
                <div onClick={()=>dispatch(toggleMode())}><div className="mode" style={{background:color}}></div> <div>{props.mode.type==='light'? 'Night theme' : 'Light theme'}</div></div>
                <div><div><span className="material-symbols-outlined">help</span></div> <div>Help</div></div>
                <div><div><span className="material-symbols-outlined">add_comment</span></div> <div>Feedback</div></div>
                <div><div><span className="material-symbols-outlined">logout</span></div> <div>Log out</div></div>
            </section>
            </>
    }



}