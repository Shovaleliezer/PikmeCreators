import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setStreamPhase } from "../store/actions/tutorial.actions"

export function TutorialStream() {
    const dispatch = useDispatch()

    const { streamPhase } = useSelector((storeState) => storeState.tutorialModule)
    const isDesktop = window.innerWidth > 1100
    const isNarrow = window.innerWidth < 550

    const [x, setX] = useState(isDesktop ? '55%' : (window.innerWidth - 400) + 'px')
    const [y, setY] = useState(isDesktop ? '30%' : '350px')

    const handlePhases = () => {
        if (!isDesktop) {
            if (streamPhase === 2) {
                setY((window.innerHeight - 70) + 'px')
                setX('50%')
            }
        }
        else {
            if (streamPhase === 2) {
                setX('50%')
                setY('80%')
            }
        }
        dispatch(setStreamPhase(streamPhase + 1))
    }

    const getClass = () => {
        if(isNarrow){
            if (streamPhase === 2) return 't-right t-right-mobile right-rotate'
            else return 't-down t-down-mobile right-rotate'
        }
        else if (isDesktop) {
            if (streamPhase === 2) return 't-right'
            else return 't-down'
        }
        else {
            if (streamPhase === 2) return 't-right-stream'
            return 't-down-stream'
        }
    }

    if (streamPhase === 0 || streamPhase > 3) return <></>

    if (streamPhase > 1) return <>
        <div className="screen-tutorial" style={{zIndex:'1'}}/>
        <div className={`${isDesktop ? 'tutorial-specific' : 'tutorial-specific-stream'} ${getClass()}`} style={{ top: y, left: x }}>
            <div className="specific-inner">
                {streamPhase === 2 && <>
                    <h1>Live Chat</h1>
                    <p>Here you can chat with your viewers about the event. </p>
                </>}
                {streamPhase === 3 && <>
                    <h1>Control panel</h1>
                    <p>Once your camera is connected you can control your stream.</p>
                </>}
            </div>
            <div className="continue-wrapper">
                <p>Step {streamPhase}/3</p>
                <h5 onClick={handlePhases}>{streamPhase === 3 ? 'Got it!' : 'Continue'}</h5>
            </div>
        </div>
    </>

    return (<>
        <div className="screen-tutorial" />
        <div className={`buddy-wrapper ${isNarrow ? 'buddy-rotate' : ''}`}>
            <img src={require('../style/imgs/tutorial/buddy-upper.png')} />
            <section className='tutorial-center'>
                <h1>Manage your stream</h1>
                <p>On this page you can chat with the viewers and control your stream settings.</p>
                <div onClick={() => dispatch(setStreamPhase(2))} className="action">Got it!</div>
                <div className="progress-circles"><div className="main-back" /><div /><div /></div>
            </section>
        </div>
    </>)
}