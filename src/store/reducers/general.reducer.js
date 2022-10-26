const INITIAL_STATE = {
    mode: {
        type: 'light',
    },
    filter: '',
    menu: '',
    popup: '',
    sleep: true
}

export function generalReducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'TOGGLE_MODE':
            if (state.mode.type === 'dark')
                return {
                    ...state, mode: {
                        type: 'light',
                    }
                }
            else return {
                ...state,
                mode: {
                    type: 'dark',
                }
            }

        case 'SET_FILTER':
            return { ...state, filter: action.filter }
        case 'SET_MENU':
            return { ...state, menu: action.menu }
        case 'SET_POPUP':
            return { ...state, popup: action.popup }
        case 'TOGGLE_MENU':
            if (state.menu === '') return { ...state, menu: 'normal' }
            else return { ...state, menu: '' }
        default:
            return state;
    }
}