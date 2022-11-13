const INITIAL_STATE = {
    mode: {
        type: 'dark',
    },
    filter: '',
    menu: '',
    popup: '',
    popupInfo: {
        player1 : {
            nickName: '',
        },
        player2:{
            nickName: '',
        }
    },
    popupBought: {
        player1: '',
        player2: '',
        tickets: '',
        date: '',
    },
    footerId: 10,
    tutorialDone: false,
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
        case 'SET_POPUP_INFO':
            return { ...state, popupInfo: action.popupInfo }
        case 'SET_POPUP_BOUGHT':
            return { ...state, popupBought: action.popupBought }
        case 'TOGGLE_MENU':
            if (state.menu === '') return { ...state, menu: 'normal' }
            else return { ...state, menu: '' }
        case 'TUTORIAL_DONE':
            return { ...state, tutorialDone: true }   
        default:
            return state;
    }
}