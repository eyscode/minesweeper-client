import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux';
import {
    register,
    login,
    logout,
    restoreSession,
    loadBoards,
    loadBoard,
    cleanBoard,
    revealCell,
    flagCell,
    pauseBoard,
    resumeBoard,
    createBoard,
    cleanLoginErrors
} from './actions'
import LoginForm from "./LoginForm";
import Home from "./Home";

class App extends Component {

    componentWillMount() {
        this.props.restoreSession();
    }

    render() {
        return (
            <div id="app">
                {[null, "failed", "loading"].includes(this.props.app.loginStatus) &&
                <LoginForm login={this.props.login} register={this.props.register}
                           loading={this.props.app.loginStatus === "loading"}
                           status={this.props.app.loginStatus} cleanErrors={this.props.cleanLoginErrors}/>}
                {this.props.app.loginStatus === 'success' &&
                <Home boardListStatus={this.props.app.boardListStatus} logout={this.props.logout}
                      loadBoards={this.props.loadBoards} boards={this.props.app.boards} board={this.props.board}
                      loadBoard={this.props.loadBoard} cleanBoard={this.props.cleanBoard}
                      revealCell={this.props.revealCell} flagCell={this.props.flagCell}
                      pauseBoard={this.props.pauseBoard} resumeBoard={this.props.resumeBoard}
                      createBoard={this.props.createBoard} username={this.props.app.username}
                      activeBoards={this.props.getBoardsByStatus(this.props.app.boards, 'active')}
                      pausedBoards={this.props.getBoardsByStatus(this.props.app.boards, 'paused')}
                      archivedBoards={this.props.getBoardsByStatus(this.props.app.boards, 'archived')}
                />}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        app: state.app,
        getBoardsByStatus: (boards, status) => Object.keys(boards).filter(id => boards[id].status === status).sort((a, b) => {
            a = new Date(boards[a].created_date);
            b = new Date(boards[b].created_date);
            if (a > b) return -1;
            if (a < b) return 1;
            if (a === b) return 0;
        }),
        board: state.board
    }
};

const mapDispatchToProps = dispatch => {
    return {
        register: (u, p) => dispatch(register(u, p)),
        login: (u, p) => dispatch(login(u, p)),
        logout: () => dispatch(logout()),
        restoreSession: () => dispatch(restoreSession()),
        loadBoards: () => dispatch(loadBoards()),
        loadBoard: (i) => dispatch(loadBoard(i)),
        cleanBoard: () => dispatch(cleanBoard()),
        revealCell: (r, c) => dispatch(revealCell(r, c)),
        flagCell: (r, c) => dispatch(flagCell(r, c)),
        pauseBoard: (i) => dispatch(pauseBoard(i)),
        resumeBoard: (i) => dispatch(resumeBoard(i)),
        createBoard: (r, c, m) => dispatch(createBoard(r, c, m)),
        cleanLoginErrors: () => dispatch(cleanLoginErrors())
    }
};

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;
