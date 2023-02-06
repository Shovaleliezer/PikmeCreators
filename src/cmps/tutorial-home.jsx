import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setHomePhase } from "../store/actions/tutorial.actions"

export function TutorialHome() {
    const dispatch = useDispatch()
    const { homePhase } = useSelector((storeState) => storeState.tutorialModule)

    useEffect(() => {
        if (homePhase === 1) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'
    }, [homePhase])

    if (homePhase !== 1) return <></>

    return (<>
        <div className="screen-tutorial" />
        <div className="buddy-wrapper">
            <img src={require('../style/imgs/tutorial/buddy-upper.png')} />
            <section className="tutorial-center">
                <h1>Manage your events</h1>
                <p>Here you can view, edit and share your events. you can edit any event you've created.</p>
                <div onClick={() => dispatch(setHomePhase(2))} className="action">Got it!</div>
            </section>
        </div>
    </>)
}