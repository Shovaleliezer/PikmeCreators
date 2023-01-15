import { useSelector, useDispatch } from "react-redux"
import { setCreatePhase } from "../store/actions/tutorial.actions"

export function TutorialCreate() {
    const dispatch = useDispatch()
    const { createPhase } = useSelector((storeState) => storeState.tutorialModule)

    if (createPhase !== 1)return <></>

    return (<>
        <div className="screen-tutorial"/>
        <div className='tutorial-specific t-down' style={{top:'calc(50% + 80px)', left:'50%'}}>
            <div className="specific-inner">
                <h1>Share with community</h1>
                <p>This option allows you to share your revenue with your supporters.</p>
            </div>
            <div className="continue-wrapper" style={{ justifyContent: 'center' }}>
                <h5 onClick={() => dispatch(setCreatePhase(3))}>Got it</h5>
            </div>
        </div>
    </>)
}