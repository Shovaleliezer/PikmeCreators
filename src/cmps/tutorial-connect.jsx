import { useDispatch,useSelector } from 'react-redux'
import { setConnectPhase } from '../store/actions/tutorial.actions'

export function TutorialConnect() {
    const dispatch = useDispatch()
    const {connectPhase} = useSelector(state => state.tutorialModule)

    if(connectPhase !== 1) return <></>

    return (<>
        <div className="screen-tutorial" />
        <div className="buddy-wrapper buddy-connect">
            <img src={require('../style/imgs/tutorial/buddy-upper.png')} />
            <section className="tutorial-center">
                    <h1>Welcome to PICKME Creators</h1>
                    <p>Before you can start creating or joining an existing event you first connect your crypto wallet.</p>
                    <div onClick={() => dispatch(setConnectPhase(2))} className="action">Lets Start!</div>
            </section>
        </div>
    </>)
}