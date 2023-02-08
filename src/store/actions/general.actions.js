export function setMenu(menu) {
    return (dispatch) => {
        dispatch({ type: 'SET_MENU', menu })
    }
}

export function setViewers(viewers) {
    return (dispatch) => {
        dispatch({ type: 'SET_VIEWERS', viewers })
    }
}
export function setPopup(popup) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP', popup })
    }
}
export function setStreamInfo(event) {
    return (dispatch) => {
        dispatch({ type: 'SET_STREAM', event })
    }
}
export function toggleMenu() {
    return (dispatch) => {
        dispatch({ type: 'TOGGLE_MENU' })
    }
}

export function setPopupEvent(popupEvent) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP_EVENT', popupEvent })
    }
}

export function setUpperPopup(upperPopup) {
    return (dispatch) => {
        dispatch({ type: 'SET_UPPER_POPUP', upperPopup })
    }
}

export function resetGeneralState() {
    return (dispatch) => {
        dispatch({ type: 'RESET_GENERAL_STATE' })
    }
}

export function setCallbackLink(callbackLink) {
    return (dispatch) => {
        dispatch({ type: 'SET_CALLBACK_LINK', callbackLink })
    }
}