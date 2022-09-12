import { userService } from '../../services/user.service'

export function signup(user) {
    return async (dispatch) => {
        const newUser = await userService.signup(user)
        dispatch({ type: 'LOGIN', user:newUser })
    }
}

export function login(credentials) {
    return async (dispatch) => {
        const user = await userService.login(credentials)
        dispatch({ type: 'LOGIN', user })
    }
}

export function refreshLogged(loggedId) {
    return async (dispatch) => {
        const user = await userService.refreshLogged(loggedId)
        dispatch({ type: 'REFRESH_LOGGED', user })
    }
}