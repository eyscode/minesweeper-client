import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux';
import {
    register,
    login,
    logout,
    restoreSession,
    cleanLoginErrors
} from './actions'
import LoginForm from "./LoginForm";

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
                <div><p><a onClick={this.props.logout}>Logout</a></p><p>Hello {this.props.app.username}</p></div>}
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
        restoreSession: () => dispatch(restoreSession()),
        cleanLoginErrors: () => dispatch(cleanLoginErrors()),
        logout: () => dispatch(logout())
    }
};

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;
