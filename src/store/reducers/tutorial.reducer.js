const INITIAL_STATE = {
    connectPhase: 0,
    home: {
        isDone: false,
        phase: 0,
    },
}

export function tutorialReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_CONNECT_PHASE':
            console.log(action.phase)
            return { ...state, connectPhase: action.phase }
        case 'SET_HOME_PHASE':
            return { ...state, home: { ...state.home, phase: action.phase, isDone: action.phase > 5 ? true : false } }
        default:
            return state
    }
}