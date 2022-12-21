const INITIAL_STATE = {
    connectPhase: 0,
    registerPhase: 0,
    homePhase: 0,

}

export function tutorialReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_CONNECT_PHASE':
            return { ...state, connectPhase: action.phase }
        case 'SET_HOME_PHASE':
            return { ...state, homePhase: action.phase }
        case 'SET_REGISTER_PHASE':
            return { ...state, registerPhase: action.phase }
        default:
            return state
    }
}