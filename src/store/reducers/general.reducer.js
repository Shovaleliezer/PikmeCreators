const INITIAL_STATE = {
    mode: {
        // type: 'light',
        // text: '#424242',
        // background: '#f5f5f5'
        type: 'dark',
        text: '#f5e9ef',
        background: '#1b1e1f'
    },
    filter: ''
}

export function generalReducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'TURN_DARK':
            state.mode = {
                isDark: true,
                text: '#f5e9ef',
                background: '#1b1e1f'
            }
            return { state }

        case 'TURN_LIGHT':
            state.mode = {
                isDark: false,
                text: '#424242',
                background: '#f5f5f5'
            }
            return { state }
        case 'SET_FILTER':
            state.filter = action.filter
        default:
            return state;
    }
}