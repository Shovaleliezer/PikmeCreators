const INITIAL_STATE = {
    mode: {
        type: 'light',
    },
    filter: '',
    menu: '',
    popup: '',
    popupInfo:{
        player1name:'',
        player2name:'',
        player1Img:'',
        player2Img:'',
        player1About:'',
        player2About:''
    },
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
        case 'SET_POPUP_INFO':
            return { ...state, popupInfo: action.popupInfo }    
        case 'TOGGLE_MENU':
            if (state.menu === '') return { ...state, menu: 'normal' }
            else return { ...state, menu: '' }
        default:
            return state;
    }
}