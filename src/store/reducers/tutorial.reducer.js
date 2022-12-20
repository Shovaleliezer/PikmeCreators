const INITIAL_STATE = {
    home: {
        isDone: false,
        phase: 0,
    },
}

export function tutorialReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_HOME_PHASE':
            return { ...state, home: { ...state.home, phase: action.phase, isDone: action.phase > 5 ? true : false } }
        default:
            return state
    }
}