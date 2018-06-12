let defaultAppState = {
    username: null,
    access_token: null,
    loginStatus: 'restoring'
};

export function app(state = defaultAppState, action) {
    switch (action.type) {
        case "CLEAN_LOGIN_ERRORS":
            return {
                ...state,
                loginStatus: null,
            };
        case "LOGIN":
        case "REGISTER":
            return {
                ...state,
                loginStatus: 'loading'
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                username: action.username,
                loginStatus: 'success',
                access_token: action.access_token
            };
        case "LOGIN_FAILED":
            return {
                ...state,
                loginStatus: 'failed'
            };
        case "LOGOUT":
            return {
                ...state,
                access_token: null,
                loginStatus: null
            };
        default:
            return state
    }
}