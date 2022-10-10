import { useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toggleMode } from "../store/actions/general.actions"
import { setMenu } from "../store/actions/general.actions"

export function Menu(props) {
    const dispatch = useDispatch()
    const textRef = useRef()
    const boxRef = useRef()
    const { menu } = useSelector((storeState) => storeState.generalModule)
    let color = props.mode.type === 'light' ? '#1b1e1f' : '#f5f5f5'

    const sendFeedback = (ev) => {
        ev.preventDefault()
        console.log({ txt: textRef.current.value, notify: boxRef.current.checked })
    }

    switch (menu) {
        case '':
            return <></>
        case 'normal':
            return <>
                <div className="screen" onClick={() => dispatch(setMenu(''))}></div>
                <section className={`menu ${props.mode.type} noselect`}>
                    <div className="hover-main"><span className="material-symbols-outlined">history</span> <div>History</div></div>
                    <div className="hover-main" onClick={() => dispatch(toggleMode())}><div className="mode" style={{ background: color }}></div> <div>{props.mode.type === 'light' ? 'Night theme' : 'Light theme'}</div></div>
                    <div className="hover-main" onClick={() => dispatch(setMenu('help'))}><span className="material-symbols-outlined">help</span> <div>Help</div></div>
                    <div className="hover-main" onClick={() => dispatch(setMenu('feedback'))}><span className="material-symbols-outlined">add_comment</span> <div>Feedback</div></div>
                    <div className="hover-main"><span className="material-symbols-outlined">logout</span> <div>Log out</div></div>
                </section>
            </>
        case 'feedback':
            return <>
                <div className="screen" onClick={() => dispatch(setMenu(''))}></div>
                <section className={`menu ${props.mode.type} noselect`}>
                    <div className="close" onClick={() => dispatch(setMenu('normal'))}><span class="material-symbols-outlined">close</span></div>
                    <form className="center-start" onSubmit={sendFeedback}>
                        <p>Feedback</p>
                        <textarea rows="5" cols="25" className={props.mode.type} ref={textRef} autoFocus required placeholder="Please tell us how can we improve our product..."></textarea>
                        <div><input type="checkbox" id="notify" ref={boxRef} />
                            <label htmlFor="notify"> Notify me for updates and information</label></div>
                        <button className={`${props.mode.type} border-${props.mode.type}`}>Send</button>
                    </form>
                </section>
            </>
        case 'help':
            return <>
                <div className="screen" onClick={() => dispatch(setMenu(''))}></div>
                <section className={`menu ${props.mode.type} noselect`}>
                    <div className="close" onClick={() => dispatch(setMenu('normal'))}><span class="material-symbols-outlined">close</span></div>
                    <div className={`center-start ${props.mode.type}`}>
                        <p className="help-p">Help</p>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to recieve reminders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to recieve reminders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to sdf dfsgdfg dfgd fgdg dgfdfg dfg rders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to recieve reminders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to recieve reminders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to sdf dfsgdfg dfgd fgdg dgfdfg dfg rders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to recieve reminders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to recieve reminders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                        <div className={`help-opt border-${props.mode.type} hover-main`}><p>how to sdf dfsgdfg dfgd fgdg dgfdfg dfg rders?</p><span class="material-symbols-outlined">chevron_right</span></div>
                    </div>
                </section>
            </>
    }
}