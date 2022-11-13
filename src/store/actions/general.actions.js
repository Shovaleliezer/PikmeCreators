export function toggleMode() {
    return (dispatch) => {
        dispatch({ type: 'TOGGLE_MODE' })
    }
}

export function turnDark() {
    return (dispatch) => {
        dispatch({ type: 'TURN_DARK' })
    }
}

export function turnLight() {
    return (dispatch) => {
        dispatch({ type: 'TURN_LIGHT' })
    }
}

export function setFilter(filter) {
    return (dispatch) => {
        dispatch({ type: 'SET_FILTER', filter })
    }
}

export function setMenu(menu) {
    return (dispatch) => {
        dispatch({ type: 'SET_MENU', menu })
    }
}
export function setMenuSide(side) {
    return (dispatch) => {
        dispatch({ type: 'SET_MENU_SIDE', side })
    }
}
export function setPopup(popup) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP', popup })
    }
}
export function setPopupInfo(popupInfo) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP_INFO', popupInfo })
    }
}
export function setPopupBought(popupBought) {
    return (dispatch) => {
        dispatch({ type: 'SET_POPUP_BOUGHT', popupBought })
    }
}

export function toggleMenu() {
    return (dispatch) => {
        dispatch({ type: 'TOGGLE_MENU' })
    }
}

export function tutorialDone(){
    return (dispatch) => {
        dispatch({ type: 'TUTORIAL_DONE' })
    }
}