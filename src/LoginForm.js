import React, {Component} from 'react';
import './LoginForm.css';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'username': '',
            'password': '',
            mode: 'Login'
        };
    }

    render() {
        return (
            <div id="login-wrapper">
                <div className="login-form">
                    <div className="title">
                        <div className="logo"/>
                        <span>Minesweeper</span></div>
                    <div className="inner">
                        {this.props.status === 'failed' && <p className="login-error">Wrong credentials</p>}
                        <div>
                            <label>Username:</label>
                            <input type="text" name="username" value={this.state.username}
                                   onChange={this.handleChange.bind(this, 'username')}/>
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" name="password" value={this.state.password}
                                   onChange={this.handleChange.bind(this, 'password')}
                                   onKeyPress={ev => this.handleEnter(ev)}/>
                        </div>
                        <div className="controls">
                            {this.state.mode === 'Login' &&
                            <button
                                disabled={!this.allFieldsAreValid() || this.props.loading}
                                onClick={() => this.allFieldsAreValid() &&
                                    !this.props.loading &&
                                    this.props.login(this.state.username, this.state.password)}> Sign in
                            </button>}
                            {this.state.mode === 'New User' &&
                            <button
                                disabled={!this.allFieldsAreValid() || this.props.loading}
                                onClick={() => this.allFieldsAreValid() &&
                                    !this.props.loading &&
                                    this.props.register(this.state.username, this.state.password)}>Sign up
                            </button>}
                            {this.state.mode === 'Login' && <a onClick={() => this.changeMode('New User')}>Register</a>}
                            {this.state.mode === 'New User' && <a onClick={() => this.changeMode('Login')}>Cancel</a>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    allFieldsAreValid() {
        return [this.state.username, this.state.password].every(f => !!f && !!f.replace(/\s+/g, ""));
    }

    handleEnter(ev) {
        if (["enter", "Enter"].includes(ev.key) && this.allFieldsAreValid()) {
            this.props.login(this.state.username, this.state.password)
        }
    }

    changeMode(mode) {
        this.setState({'mode': mode, username: '', password: ''});
        this.props.cleanErrors();
    }

    handleChange(field, event) {
        this.setState({[field]: event.target.value});
    }
}

export default LoginForm;
