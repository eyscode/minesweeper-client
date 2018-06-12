function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function startLogin() {
    return {
        type: 'LOGIN'
    }
}

function startRegister() {
    return {
        type: 'REGISTER'
    }
}

export function logout() {
    setCookie('access_token', '', 0);
    setCookie('username', '', 0);
    return {
        type: 'LOGOUT'
    }
}

function doLogin(username, password) {
    return fetch('http://localhost:5001/auth', {
        body: JSON.stringify({username, password}),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
    });
}

function doRegister(username, password) {
    return fetch('http://localhost:5001/register', {
        body: JSON.stringify({username, password}),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
    });
}

function checkAuth(access_token) {
    return fetch('http://localhost:5001/ping', {
        headers: {
            'Authorization': `JWT ${access_token}`
        },
        mode: 'cors'
    });
}

function loginSuccess(access_token, username) {
    return {
        type: 'LOGIN_SUCCESS',
        access_token,
        username
    };
}

function loginFailed(data) {
    return {
        type: 'LOGIN_FAILED',
        data
    };
}

export function login(username, password) {
    return function (dispatch, getState) {
        dispatch(startLogin(username, password));
        return doLogin(username, password).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(loginSuccess(data.access_token, username));
                setCookie('access_token', data.access_token, 30);
                setCookie('username', username, 30);
            }
        ).catch(error => {
            dispatch(loginFailed(error));
        });
    };
}

export function register(username, password) {
    return function (dispatch, getState) {
        dispatch(startRegister());
        return doRegister(username, password).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(login(username, password));
            }
        ).catch(error => {
            dispatch(loginFailed(error));
        });
    };
}

export function restoreSession() {
    const access_token = getCookie('access_token');
    const username = getCookie('username');
    return function (dispatch, getState) {
        if (!!access_token) {
            return checkAuth(access_token).then(res => {
                if (res.ok) {
                    return res.json();
                }
                dispatch(logout());
            }).then(data => {
                dispatch(loginSuccess(access_token, username));
            }).catch(error => {
                dispatch(logout());
            });
        } else {
            dispatch(logout());
        }
    };
}

export function cleanLoginErrors() {
    return {
        type: 'CLEAN_LOGIN_ERRORS'
    };
}
