import React, {Component} from 'react';
import './Home.css';
import Game from "./Game";
import CreateBoardForm from "./CreateBoardForm";

class Home extends Component {
    componentWillMount() {
        this.props.loadBoards();
    }

    renderButton(b) {
        if (b.status === 'active') {
            return <button onClick={() => this.onPlay(b.id)}>Play</button>;
        } else if (b.status === 'paused') {
            return <button onClick={() => this.onResume(b.id)}>Resume</button>;
        } else {
            return <button onClick={() => this.onResults(b.id)}>See results</button>;
        }
    }

    onPlay(boardId) {
        this.props.loadBoard(boardId);
    }

    onResume(boardId) {
        this.props.loadBoard(boardId);
        this.props.resumeBoard(boardId);
    }

    onResults(boardId) {
        this.props.loadBoard(boardId);
    }

    render() {

        return (
            <div id="home">
                <header>
                    <div className="title"><div className="logo"/><span>Minesweeper</span></div>
                    <p>Welcome Back <b>{this.props.username}</b></p>
                    <div className="separator"/>
                    <a onClick={this.props.logout}>Logout</a>
                </header>
                <main>
                    {!!this.props.board.id && <Game board={this.props.board} cleanBoard={this.props.cleanBoard}
                                                    revealCell={this.props.revealCell} flagCell={this.props.flagCell}
                                                    pauseBoard={this.props.pauseBoard}
                                                    resumeBoard={this.props.resumeBoard}/>}
                    {!this.props.board.id && <div>
                        <section>
                            <h3>New game</h3>
                            <CreateBoardForm createBoard={this.props.createBoard}/>
                        </section>
                        <section>
                            <h3>List of games</h3>
                            {this.props.boards === null && <div>Loading games...</div>}
                            {this.props.boards && this.props.boards.length !== 0 &&
                            <ul className="list-games">
                                {this.props.boards.map((b, i) => (
                                    <li key={i}>
                                        <p><b>Id:</b> {b.id}</p>
                                        <p><b>Status:</b> {b.status}</p>
                                        {!!b.result && <b className={`board-${b.result}`}>{b.result}</b>}
                                        {this.renderButton(b)}
                                    </li>))
                                }
                                <div className="clear"/>
                            </ul>}
                            {this.props.boards && this.props.boards.length === 0 &&
                            <div className="empty-list">No games played yet.</div>}
                        </section>
                    </div>}
                </main>
            </div>
        );
    }
}

export default Home;
