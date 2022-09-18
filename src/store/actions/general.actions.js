export function turnDark() {
    return (dispatch) => {
        dispatch({ type: 'TURN_DARK' })
    }
}

export function turnLight() {
    return (dispatch) => {
        dispatch({ type: 'TURN_LIGHT' })
    }
}

export function setFilter(filter){
    return (dispatch) => {
        dispatch({ type: 'SET_FILTER',filter })
    }
}