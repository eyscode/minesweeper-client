import {normalize, schema} from 'normalizr';

let defaultBoardState = {
    id: null,
    state: null,
    status: null
};


let defaultAppState = {
    username: null,
    access_token: null,
    loginStatus: 'restoring',
    boardListStatus: null,
    boards: [],
    actives: [],
    paused: [],
    archived: []
};

const boardSchema = new schema.Entity('boards');
const boardListSchema = new schema.Array(boardSchema);

function updateBoards(boardId, boardState, boards) {
    return {
        ...boards,
        [boardId]: {
            ...boards[boardId],
            ...boardState
        }
    };
}

function addBoard(newBoard, boards) {
    return {
        ...boards,
        [newBoard.id]: newBoard
    }
}

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
        case "FETCH_BOARDS":
            return {
                ...state,
                boardListStatus: "loading"
            };
        case "FAILED_FETCH_BOARDS":
            return {
                ...state,
                boardListStatus: "failed"
            };
        case "SUCCESS_FETCH_BOARDS":
            return {
                ...state,
                boardListStatus: "success",
                boards: normalize(action.boards, boardListSchema).entities.boards
            };
        case "PAUSED_BOARD":
            return {
                ...state,
                boards: updateBoards(action.boardId, {status: 'paused'}, state.boards)
            };
        case "RESUMED_BOARD":
            return {
                ...state,
                boards: updateBoards(action.boardId, {status: 'active'}, state.boards)
            };
        case "CREATED_BOARD":
            return {
                ...state,
                boards: addBoard(action.board, state.boards)
            };
        case "WIN_BOARD":
            return {
                ...state,
                boards: updateBoards(action.boardId, {status: 'archived', result: 'win'}, state.boards)
            };
        case "LOSE_BOARD":
            return {
                ...state,
                boards: updateBoards(action.boardId, {status: 'archived', result: 'lost'}, state.boards)
            };
        default:
            return state
    }
}

export function board(state = defaultBoardState, action) {
    switch (action.type) {
        case "FETCH_BOARD":
            return {
                ...state,
                status: "loading"
            };
        case "FAILED_FETCH_BOARD":
            return {
                ...state,
                status: "failed"
            };
        case "SUCCESS_FETCH_BOARD":
            return {
                ...state,
                ...action.board
            };
        case "CLEAN_BOARD":
            return {
                ...defaultBoardState
            };
        case "PAUSED_BOARD":
            return {
                ...state,
                elapsed_time: action.elapsedTime,
                status: 'paused'
            };
        case "RESUMED_BOARD":
            return {
                ...state,
                resume_date: action.resumeDate,
                status: 'active'
            };
        default:
            return state
    }
}