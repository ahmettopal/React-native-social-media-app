import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
    UPDATE_USER_AVATAR,
    UPDATE_USER_AVATAR_FAIL,
    UPDATE_USER_USERNAME,
    UPDATE_USER_USERNAME_FAIL,
    UPDATE_USER_BIYOGRAFI,
} from "./types";

import AuthService from "../services/auth.service";

export const register = (username, email, password) => (dispatch) => {
    return AuthService.register(username, email, password).then(
        (response) => {
            dispatch({
                type: REGISTER_SUCCESS,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: REGISTER_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
        (data) => {
            //console.log(data);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user: data },
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: LOGIN_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const updateAvatar = (avatar, avatarType) => (dispatch) => {
    return AuthService.updateAvatar(avatar, avatarType).then(
        (data) => {
            dispatch({
                type: UPDATE_USER_AVATAR,
                payload: { avatar: data }
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: UPDATE_USER_AVATAR_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    )
}

export const updateUsername = (username) => (dispatch) => {
    return AuthService.updateUsername(username).then(
        (data) => {
            dispatch({
                type: UPDATE_USER_USERNAME,
                payload: { username: data }
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: UPDATE_USER_USERNAME_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    )
}

export const updateBiyografi = (biyografi) => (dispatch) => {
    return AuthService.updateBiyografi(biyografi).then(
        (data) => {
            dispatch({
                type: UPDATE_USER_BIYOGRAFI,
                payload: { biyografi: data }
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: UPDATE_USER_BIYOGRAFI_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    )
}


export const logout = () => (dispatch) => {
    AuthService.logout();

    dispatch({
        type: LOGOUT,
    });
};
