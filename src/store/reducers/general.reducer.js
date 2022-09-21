const INITIAL_STATE = {
    mode: {
        type: 'light',
        text: '#424242',
        background: '#f5f5f5'
    },
    filter: ''
}

export function generalReducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'TOGGLE_MODE':
            if (state.mode.type === 'dark')
                return {
                    ...state, mode: {
                        type: 'light',
                        text: '#424242',
                        background: '#f5f5f5'
                    }
                }
            else return {
                ...state,
                mode: {
                    type: 'dark',
                    text: '#f5e9ef',
                    background: '#1b1e1f'
                }
            }

        // case 'TURN_DARK':
        //     state.mode = {
        //         type: 'dark',
        //         text: '#f5e9ef',
        //         background: '#1b1e1f'
        //     }
        //     // return { state }

        // case 'TURN_LIGHT':
        //     state.mode = {
        //         type: 'light',
        //         text: '#424242',
        //         background: '#f5f5f5'
        //     }
        //     // return { state }
        case 'SET_FILTER':
        return { ...state,filter:action.filter }
        default:
            return state;
    }
}