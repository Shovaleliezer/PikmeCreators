const INITIAL_STATE = {
    viewers: 0,
    menu: '',
    popup: '',
    popupEvent: '',
    upperPopup: '',
    streamPopup:'',
    callbackLink: '',
    streamInfo: {}
}

export function generalReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_FILTER':
            return { ...state, filter: action.filter }
        case 'SET_VIEWERS':
            return { ...state, viewers: action.viewers }
        case 'SET_MENU':
            return { ...state, menu: action.menu }
        case 'SET_STREAM':
            return { ...state, streamInfo: action.event }
        case 'SET_POPUP':
            return { ...state, popup: action.popup }
        case 'SET_POPUP_INFO':
            return { ...state, popupInfo: action.popupInfo }
        case 'SET_POPUP_BOUGHT':
            return { ...state, popupBought: action.popupBought }
        case 'TOGGLE_MENU':
            if (state.menu === '') return { ...state, menu: 'normal' }
            else return { ...state, menu: '' }
        case 'SET_POPUP_EVENT':
            return { ...state, popupEvent: action.popupEvent }
        case 'SET_UPPER_POPUP':
            return { ...state, upperPopup: action.upperPopup }
        case 'SET_CALLBACK_LINK':
            return { ...state, callbackLink: action.callbackLink }
        case 'RESET_GENERAL_STATE':
            return {
                viewers: 0,
                menu: '',
                popup: '',
                popupEvent: '',
                upperPopup: '',
                streamInfo: {}
            }
        default:
            return state;
    }
}