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

function doFetch(url, method, token, body, successCb, failCb) {
    const headers = {'content-type': 'application/json'};
    if (token) {
        headers['Authorization'] = `JWT ${token}`;
    }
    const settings = {
        headers: {
            ...headers
        },
        mode: 'cors',
        method: method,
    };
    if (body) {
        settings.body = body;
    }
    return fetch(url, settings).then(res => res.json().then(data => {
            return {
                ok: res.ok,
                data: data
            };
        }).then(res => {
            if (res.ok) {
                successCb(res.data);
            } else {
                failCb(res.data);
            }
        }).catch(error => {
            failCb(error);
        })
    );
}

function doLogin(username, password, successCb, failCb) {
    return doFetch(`${apiURL}/auth`, 'POST', null, JSON.stringify({username, password}), successCb, failCb);
}

function doRegister(username, password, successCb, failCb) {
    return doFetch(`${apiURL}/register`, 'POST', null, JSON.stringify({username, password}), successCb, failCb);
}

function fetchBoards(access_token, successCb, failCb) {
    return doFetch(`${apiURL}/boards`, 'GET', access_token, null, successCb, failCb);
}

function fetchBoard(access_token, id, successCb, failCb) {
    return doFetch(`${apiURL}/boards/${id}`, 'GET', access_token, null, successCb, failCb);
}

function checkAuth(access_token, successCb, failCb) {
    return doFetch(`${apiURL}/ping`, 'GET', access_token, null, successCb, failCb);
}

function doRevealCell(access_token, boardId, row, col, successCb, failCb) {
    return doFetch(`${apiURL}/boards/${boardId}/reveal`, 'POST', access_token, JSON.stringify({
        row,
        col
    }), successCb, failCb);
}

function doFlagCell(access_token, boardId, row, col, successCb, failCb) {
    return doFetch(`${apiURL}/boards/${boardId}/flag`, 'POST', access_token, JSON.stringify({
        row,
        col
    }), successCb, failCb);
}

function doPauseBoard(access_token, boardId, successCb, failCb) {
    return doFetch(`${apiURL}/boards/${boardId}/pause`, 'POST', access_token, null, successCb, failCb);
}

function doResumeBoard(access_token, boardId, successCb, failCb) {
    return doFetch(`${apiURL}/boards/${boardId}/resume`, 'POST', access_token, null, successCb, failCb);
}

function doCreateBoard(access_token, rows, columns, mines, successCb, failCb) {
    return doFetch(`${apiURL}/boards`, 'POST', access_token, JSON.stringify({rows, columns, mines}), successCb, failCb);
}

export function logout(data) {
    setCookie('access_token', '', 0);
    setCookie('username', '', 0);
    return {
        type: 'LOGOUT'
    }
}

export function cleanBoard() {
    return {
        type: 'CLEAN_BOARD'
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

export function cleanLoginErrors() {
    return {
        type: 'CLEAN_LOGIN_ERRORS'
    };
}

export function loadBoards() {
    return function (dispatch, getState) {
        dispatch(startLoadBoards());
        const access_token = getState().app.access_token;
        return fetchBoards(access_token, data => dispatch(receiveBoards(data)), err => dispatch(failedFetchBoards(err)));
    }
}

export function loadBoard(id) {
    return function (dispatch, getState) {
        dispatch(startLoadBoard());
        const access_token = getState().app.access_token;
        return fetchBoard(access_token, id, data => dispatch(receiveBoard(data)), err => dispatch(failedFetchBoard(err)));
    };
}

export function login(username, password) {
    return function (dispatch, getState) {
        dispatch(startLogin(username, password));
        return doLogin(username, password, data => {
            dispatch(loginSuccess(data.access_token, username));
            setCookie('access_token', data.access_token, 30);
            setCookie('username', username, 30);
        }, err => dispatch(loginFailed(err)));
    };
}

export function register(username, password) {
    return function (dispatch, getState) {
        dispatch(startRegister());
        return doRegister(username, password, data => dispatch(login(username, password)), err => dispatch(loginFailed(err)));
    };
}


export function restoreSession() {
    const access_token = getCookie('access_token');
    const username = getCookie('username');
    return function (dispatch, getState) {
        if (!!access_token) {
            return checkAuth(access_token,
                data => dispatch(loginSuccess(access_token, username)),
                err => {
                    if (typeof err === "string") {
                        alert(err);
                    } else if (err.error && err.description) {
                        alert(`${err.error}: ${err.description}`);
                    }
                    dispatch(logout(err));
                }
            );
        } else {
            dispatch(logout("User not logged yet"));
        }
    };
}

export function revealCell(row, col) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        const boardId = getState().board.id;
        return doRevealCell(access_token, boardId, row, col, data => {
            dispatch(receiveBoard(data));
            if (data.status === 'archived' && data.result === 'win') {
                dispatch(winBoard(data.id));
            } else if (data.status === 'archived' && data.result === 'lost') {
                dispatch(loseBoard(data.id));
            }
        }, err => {
            console.log(`Fail to reveal cell at (${row}, ${col})`);
            console.log(err)
        });
    };
}

export function flagCell(row, col) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        const boardId = getState().board.id;
        return doFlagCell(access_token, boardId, row, col, data => dispatch(receiveBoard(data)), err => {
            console.log(`Failed to flag cell at (${row}, ${col})`);
            console.log(err)
        });
    };
}

export function pauseBoard(boardId) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        boardId = boardId || getState().board.id;
        return doPauseBoard(access_token, boardId, data => dispatch(pausedBoard(boardId, data.elapsed_time)), err => {
            console.log('Failed to pause game');
            console.log(err);
        });
    };
}

export function resumeBoard(boardId) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        boardId = boardId || getState().board.id;
        return doResumeBoard(access_token, boardId, data => dispatch(pausedBoard(boardId, data.elapsed_time)), err => {
            console.log('Failed to resume game');
            console.log(err);
        });
    };
}

export function createBoard(rows, columns, mines) {
    return function (dispatch, getState) {
        const access_token = getState().app.access_token;
        return doCreateBoard(access_token, rows, columns, mines, data => {
            dispatch(receiveBoard(data));
            dispatch(createdBoard(data));
        }, err => {
            console.log('Failed to create game');
            console.log(err);
        });
    };
}