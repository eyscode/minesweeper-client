const apiURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://minesweeper-eys.herokuapp.com';

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

function startLoadBoards() {
    return {
        type: 'FETCH_BOARDS'
    };
}

function startLoadBoard() {
    return {
        type: 'FETCH_BOARD'
    };
}

function failedFetchBoards() {
    return {
        type: 'FAILED_FETCH_BOARDS'
    };
}

function receiveBoards(boards) {
    return {
        type: 'SUCCESS_FETCH_BOARDS',
        boards
    };
}

function failedFetchBoard() {
    return {
        type: 'FAILED_FETCH_BOARD'
    };
}

function receiveBoard(board) {
    return {
        type: 'SUCCESS_FETCH_BOARD',
        board
    };
}

function doLogin(username, password) {
    return fetch(`${apiURL}/auth`, {
        body: JSON.stringify({username, password}),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
    });
}

function doRegister(username, password) {
    return fetch(`${apiURL}/register`, {
        body: JSON.stringify({username, password}),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
    });
}

function fetchBoards(access_token) {
    return fetch(`${apiURL}/boards`, {
        headers: {
            'Authorization': `JWT ${access_token}`
        },
        mode: 'cors'
    });
}

function fetchBoard(access_token, id) {
    return fetch(`${apiURL}/boards/${id}`, {
        headers: {
            'Authorization': `JWT ${access_token}`
        },
        mode: 'cors'
    });
}

function checkAuth(access_token) {
    return fetch(`${apiURL}/ping`, {
        headers: {
            'Authorization': `JWT ${access_token}`
        },
        mode: 'cors'
    });
}

function doRevealCell(access_token, boardId, row, col) {
    return fetch(`${apiURL}/boards/${boardId}/reveal`, {
        body: JSON.stringify({row, col}),
        headers: {
            'content-type': 'application/json',
            'Authorization': `JWT ${access_token}`
        },
        method: 'POST',
        mode: 'cors'
    });
}

function doFlagCell(access_token, boardId, row, col) {
    return fetch(`${apiURL}/boards/${boardId}/flag`, {
        body: JSON.stringify({row, col}),
        headers: {
            'content-type': 'application/json',
            'Authorization': `JWT ${access_token}`
        },
        method: 'POST',
        mode: 'cors'
    });
}

function doPauseBoard(access_token, boardId) {
    return fetch(`${apiURL}/boards/${boardId}/pause`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `JWT ${access_token}`
        },
        method: 'POST',
        mode: 'cors'
    });
}

function doResumeBoard(access_token, boardId) {
    return fetch(`${apiURL}/boards/${boardId}/resume`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `JWT ${access_token}`
        },
        method: 'POST',
        mode: 'cors'
    });
}

function doCreateBoard(access_token, rows, columns, mines) {
    return fetch(`${apiURL}/boards`, {
        body: JSON.stringify({rows, columns, mines}),
        headers: {
            'content-type': 'application/json',
            'Authorization': `JWT ${access_token}`
        },
        method: 'POST',
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

function createdBoard(board) {
    return {
        type: 'CREATED_BOARD',
        board
    };
}

function winBoard(boardId) {
    return {
        type: 'WIN_BOARD',
        boardId
    };
}

function loseBoard(boardId) {
    return {
        type: 'LOSE_BOARD',
        boardId
    };
}

export function logout() {
    setCookie('access_token', '', 0);
    setCookie('username', '', 0);
    return {
        type: 'LOGOUT'
    }
}

export function loadBoards() {
    return function (dispatch, getState) {
        dispatch(startLoadBoards());
        const access_token = getState().app.access_token;
        return fetchBoards(access_token).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(receiveBoards(data));
            }
        ).catch(error => {
            dispatch(failedFetchBoards(error));
        });
    };
}

export function loadBoard(id) {
    return function (dispatch, getState) {
        dispatch(startLoadBoard());
        const access_token = getState().app.access_token;
        return fetchBoard(access_token, id).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(receiveBoard(data));
            }
        ).catch(error => {
            dispatch(failedFetchBoard(error));
        });
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

export function cleanBoard() {
    return {
        type: 'CLEAN_BOARD'
    };
}

export function revealCell(row, col) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        const boardId = getState().board.id;
        return doRevealCell(access_token, boardId, row, col).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(receiveBoard(data));
                if (data.status === 'archived' && data.result === 'win') {
                    dispatch(winBoard(data.id));
                } else if (data.status === 'archived' && data.result === 'lost') {
                    dispatch(loseBoard(data.id));
                }
            }
        );
    };
}

export function flagCell(row, col) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        const boardId = getState().board.id;
        return doFlagCell(access_token, boardId, row, col).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(receiveBoard(data));
            }
        );
    };
}

export function pausedBoard(boardId, elapsedTime) {
    return {
        type: 'PAUSED_BOARD',
        boardId,
        elapsedTime
    };
}

export function resumedBoard(boardId, resumeDate) {
    return {
        type: 'RESUMED_BOARD',
        boardId,
        resumeDate
    };
}

export function pauseBoard(boardId) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        boardId = boardId || getState().board.id;
        return doPauseBoard(access_token, boardId).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(pausedBoard(boardId, data.elapsed_time));
            }
        );
    };
}

export function resumeBoard(boardId) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        boardId = boardId || getState().board.id;
        return doResumeBoard(access_token, boardId).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(resumedBoard(boardId, data.resume_date));
            }
        );
    };
}

export function createBoard(rows, columns, mines) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        return doCreateBoard(access_token, rows, columns, mines).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(
            data => {
                dispatch(receiveBoard(data));
                dispatch(createdBoard(data));
            }
        );
    };
}

export function cleanLoginErrors() {
    return {
        type: 'CLEAN_LOGIN_ERRORS'
    };
}
