import { useSelector, useDispatch } from "react-redux"
import { setRegisterPhase } from "../store/actions/tutorial.actions"

export function TutorialRegister() {
    const dispatch = useDispatch()
    const { registerPhase } = useSelector((storeState) => storeState.tutorialModule)

    const getStyle = () => {
        if (window.innerWidth < 700) return { top: '220px', left: '50%' }
        else return { top: '320px', left: (window.innerWidth - 320) + 'px' }
    }

    if (registerPhase === 0 || registerPhase > 2) return <></>

    if (registerPhase === 2) return <>
        <div className="screen-tutorial" />
        <div className='tutorial-specific t-up' style={getStyle()}>
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
                <h1>Registered successfully!</h1>
                <p>You can new start creating your events or joining an existing one.</p>
                <div onClick={() => dispatch(setRegisterPhase(2))} className="action">Got it!</div>
                <div className="progress-circles"><div className="main-back" /><div /></div>
            </section>
        </div>
    </>)
}