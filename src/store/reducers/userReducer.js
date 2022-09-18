const INITIAL_STATE = {
    users: [],
    loggedinUser: '',
    isModalOpen: false,
    isLogin: true,
}

export function userReducer(state = INITIAL_STATE, action) {
    let users
    switch (action.type) {
        case 'LOAD_USERS':
            state.users = action.users
            return { users: state.users }
        case 'REMOVE_USER':
            users = state.users.filter(user => user.id !== action.id)
            return { users }
        case 'EDIT_USER':
            users = state.users.map(curruser => (curruser._id === action.user._id) ? action.user : curruser)
            return state.users
        case 'ADD_USER':
            state.users = [...state.users]
            return { users: state.users }
        case 'LOGIN':
            state.loggedinUser = action.user
            return { ...state }
        case 'LOGOUT':
            state.loggedinUser = null
            return { ...state }
        case 'OPEN_MODAL':
            state.isModalOpen = true
            state.isLogin = action.isLogin
            return { ...state }
        case 'CLOSE_MODAL':
            state.isModalOpen = false
            return { ...state }
        default:
            return state;
    }
}