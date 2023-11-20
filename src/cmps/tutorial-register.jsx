import { useSelector, useDispatch } from "react-redux"
import { setRegisterPhase } from "../store/actions/tutorial.actions"

export function TutorialRegister() {
    const dispatch = useDispatch()
    const { registerPhase } = useSelector((storeState) => storeState.tutorialModule)

    const getStyle = () => {
        if (window.innerWidth < 930) return { bottom: '-100px', left: '50%', top: 'unset' }
        else return { top: '320px', left: (window.innerWidth - 320) + 'px' }
    }

    if (registerPhase === 0 || registerPhase > 2) return <></>

    if (registerPhase === 2) return <>
        <div className="screen-tutorial" />
        <div className={`tutorial-specific ${window.innerWidth < 930 ? 't-down-mid' : 't-up'}`} style={getStyle()}>
            <div className="specific-inner">
                <h1>Create & Join</h1>
                <p>Here you can create new event or join an existing one.</p>
            </div>
            <div className="continue-wrapper" style={{ justifyContent: 'center' }}>
                <h5 onClick={() => dispatch(setRegisterPhase(3))}>Continue</h5>
            </div>
        </div>
    </>

    return (<>
        <div className="screen-tutorial" />
        <div className="buddy-wrapper">
            <img src={require('../style/imgs/tutorial/buddy-upper.png')} />
            <section className="tutorial-center">
                <h1>Welcome to pikmeTV creator mode</h1>
                <p>Your registration is now complete.</p>
                <div onClick={() => dispatch(setRegisterPhase(2))} className="action">Got it!</div>
                <div className="progress-circles"><div className="main-back" /><div /></div>
            </section>
        </div>
    </>)
}