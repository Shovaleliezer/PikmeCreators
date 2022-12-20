
export function setHomePhase(phase){
    return (dispatch) => {
        dispatch({ type: 'SET_HOME_PHASE' ,phase})
    }
}
