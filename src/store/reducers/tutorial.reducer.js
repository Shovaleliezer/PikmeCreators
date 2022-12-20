const INITIAL_STATE = {
    connectDone: false,
    home: {
        isDone: false,
        phase: 0,
    },
}

export function tutorialReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'CONNECT_DONE':
            return { ...state, connectDone: true }
        case 'SET_HOME_PHASE':
            return { ...state, home: { ...state.home, phase: action.phase, isDone: action.phase > 5 ? true : false } }
        default:
            return state
    }
}