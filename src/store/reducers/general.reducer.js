const INITIAL_STATE = {
    mode: {
        type: 'light',
        text: '#424242',
        background: '#f5f5f5'
    },
    filter: '',
    menu: ''
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

        case 'SET_FILTER':
            return { ...state, filter: action.filter }
        case 'SET_MENU':
            return { ...state, menu: action.menu }
            case 'TOGGLE_MENU':
                if(state.menu==='') return { ...state, menu: 'normal' }
                else return { ...state, menu: '' }
        default:

            return state;


    }
}