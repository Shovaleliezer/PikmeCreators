

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

export function toggleMenu() {
    return (dispatch) => {
        dispatch({ type: 'TOGGLE_MENU' })
    }
}
