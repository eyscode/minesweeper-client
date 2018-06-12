import React, {Component} from 'react';
import './Game.css';
import './Board.css';

class Board extends Component {
    renderNumber(value) {
        if (typeof value === 'number') {
            if (value !== 0) {
                return value;
            }
        }
    }

    renderCells(i) {
        const row = [];
        for (let j = 0; j < this.props.cols; j++) {
            const statuses = {
                '-': 'unrevealed',
                '@': 'mine',
                'x': 'open-mine',
                'f': 'flagged',
                'w': 'wrong-flagged'
            };
            const status = statuses[this.props.state[i][j]];
            const statusClass = status ? status : 'revealed';
            row.push(
                <div key={`${i}-${j}`} className={`cell ${statusClass}`}
                     onClick={() => this.props.state[i][j] === '-' && this.props.revealCell(i, j)}
                     onContextMenu={() => (this.props.state[i][j] === '-' || this.props.state[i][j] === 'f') && this.props.flagCell(i, j)}>
                    <div
                        className="inner">{this.renderNumber(this.props.state[i][j])}
                    </div>
                </div>
            );
        }
        return row;
    }

    renderBoard() {
        const body = [];
        for (let i = 0; i < this.props.rows; i++) {
            body.push(<div key={i} className="row">{this.renderCells(i)}</div>)
        }
        return body;
    }

    render() {
        return (
            <div className="full-board">
                {this.renderBoard()}
            </div>
        );
    }
}

function secondsToHms(d) {
    d = Number(d);

    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

class CountUp extends Component {
    constructor(props) {
        super(props);
        this.state = {elapsedTime: props.elapsedTime || 0};
        this.tick = this.tick.bind(this)
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    tick() {
        this.setState({elapsedTime: this.state.elapsedTime + 1})
    }

    render() {
        return <span>{secondsToHms(this.state.elapsedTime)}</span>
    }
}

class Game extends Component {

    render() {
        const previousElapsedTime = this.props.board.elapsed_time;
        let elapsedTime = Math.round((Date.now() - new Date(this.props.board.created_date)) / 1000);
        if (previousElapsedTime) {
            elapsedTime = previousElapsedTime + Math.round((Date.now() - new Date(this.props.board.resume_date)) / 1000);
        }
        return (
            <div id="game">
                <h3>ID: {this.props.board.id}
                    {this.props.board.status === 'archived' && this.props.board.result === 'win' &&
                    <span className="badge badge-win">You WIN</span>}
                    {this.props.board.status === 'archived' && this.props.board.result === 'lost' &&
                    <span className="badge badge-lost">You LOST</span>}
                </h3>
                <p className="status">Status: {this.props.board.status}</p>
                {this.props.board.status === "active" && <p><CountUp elapsedTime={elapsedTime}/></p>}
                {this.props.board.status !== "active" &&
                <p><span>{secondsToHms(this.props.board.elapsed_time)}</span></p>}
                <div>
                    <Board rows={this.props.board.state.length} cols={this.props.board.state[0].length}
                           state={this.props.board.state}
                           revealCell={(i, j) => this.props.board.status === 'active' && this.props.revealCell(i, j)}
                           flagCell={(i, j) => this.props.board.status === 'active' && this.props.flagCell(i, j)}/>
                </div>
                <div className="controls">
                    {this.props.board.status === 'active' &&
                    <button onClick={() => this.props.pauseBoard()}>Pause Game</button>}
                    {this.props.board.status === 'paused' &&
                    <button onClick={() => this.props.resumeBoard()}>Resume Game</button>}
                    <a className="back" onClick={this.props.cleanBoard}>Back</a>
                </div>
            </div>
        );
    }
}

export default Game;
