
export function connectComplete(){
    return (dispatch) => {
        dispatch({ type: 'CONNECT_DONE' })
    }
}

export function setHomePhase(phase){
    return (dispatch) => {
        dispatch({ type: 'SET_HOME_PHASE' ,phase})
    }
}

