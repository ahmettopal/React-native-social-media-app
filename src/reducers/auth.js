import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    UPDATE_USER_AVATAR,
    UPDATE_USER_AVATAR_FAIL,
    UPDATE_USER_USERNAME,
    UPDATE_USER_BIYOGRAFI
} from "../actions/types";

const initialState = {
    user: { accessToken: "", email: "", id: "", roles: "", username: "", avatar: "" }
}

//console.log(initialState);

export default function (state = initialState.user, action) {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user,
            };
        case UPDATE_USER_AVATAR:
            return {
                ...state,
                isLoggedIn: true,
                user: { ...state.user, avatar: payload.avatar }
            };
        case UPDATE_USER_USERNAME:
            return {
                ...state,
                isLoggedIn: true,
                user: { ...state.user, username: payload.username }
            };
        case UPDATE_USER_BIYOGRAFI:
            return {
                ...state,
                isLoggedIn: true,
                user: { ...state.user, biyografi: payload.biyografi }
            }
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        default:
            return state;
    }
}
