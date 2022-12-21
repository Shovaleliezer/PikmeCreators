
export function setConnectPhase(phase){
    return (dispatch) => {
        dispatch({ type: 'SET_CONNECT_PHASE',phase })
    }
}

export function setRegisterPhase(phase){
    return (dispatch) => {
        dispatch({ type: 'SET_REGISTER_PHASE',phase })
    }
}

export function setHomePhase(phase){
    return (dispatch) => {
        dispatch({ type: 'SET_HOME_PHASE' ,phase})
    }
}

export function setCreatePhase(phase){
    return (dispatch) => {
        dispatch({ type: 'SET_CREATE_PHASE' ,phase})
    }
}

