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

export function setPopupPlayers(popupPlayers) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP_PLAYERS', popupPlayers })
    }
}

export function setLinkId(linkId) {
    return (dispatch) => {
        dispatch({ type: 'SET_LINK_ID', linkId })
    }
}

export function setPopupView(popupView) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP_VIEW', popupView })
    }
}

export function setPopupEvent(popupEvent) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP_EVENT', popupEvent })
    }
}

export function setPopupStats(popupStats) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP_STATS', popupStats })
    }
}

export function setStreamInfo(event) {
    return (dispatch) => {
        dispatch({ type: 'SET_STREAM', event })
    }
}

export function setStreamShow(show) {
    return (dispatch) => {
        dispatch({ type: 'SET_STREAM_SHOW', show })
    }
}

export function toggleMenu() {
    return (dispatch) => {
        dispatch({ type: 'TOGGLE_MENU' })
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