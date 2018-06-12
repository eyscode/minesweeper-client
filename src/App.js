import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux';
import {
    register,
    login,
    logout,
    restoreSession,
    loadBoards,
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
                {(this.props.app.loginStatus === null || this.props.app.loginStatus === 'failed') &&
                <LoginForm login={this.props.login} register={this.props.register}
                           status={this.props.app.loginStatus} cleanErrors={this.props.cleanLoginErrors}/>}
                {this.props.app.loginStatus === 'success' &&
                <Home boardListStatus={this.props.app.boardListStatus} logout={this.props.logout}
                      loadBoards={this.props.loadBoards} boards={this.props.app.boards}
                      createBoard={this.props.createBoard} username={this.props.app.username}
                />}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        app: state.app,
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
        createBoard: (r, c, m) => dispatch(createBoard(r, c, m)),
        cleanLoginErrors: () => dispatch(cleanLoginErrors())
    }
};

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;
