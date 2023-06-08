import { getLocalStorageItem } from '../utilities/helpers'

export const initialState = { token: null, user: null }

export const initializer = () => {
    return {
        token: getLocalStorageItem('token') || null,
        user : getLocalStorageItem('user') || null
    }
}

export const LOGIN       = 'LOGIN'
export const LOGOUT      = 'LOGOUT'
export const SET_USER    = 'SET_USER'
export const UPDATE_USER = 'UPDATE_USER'

const AuthReducer = (state, { type, payload }) => {
    switch (type) {
        case LOGIN:
            return {
                ...state,
                token: payload.token,
                user : payload.user
            }
        case LOGOUT:
            return {
                ...initialState
            }
        case SET_USER:
            return {
                ...state,
                user: payload
            }
        case UPDATE_USER:
            return {
                ...state,
                user: payload.user
            }
        default:
            throw new Error(`Unhandled action type: ${type}`)
    }
}

export default AuthReducer