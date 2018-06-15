import React, {Component} from 'react';
import './Home.css';
import Game from "./Game";
import CreateBoardForm from "./CreateBoardForm";
import * as moment from 'moment';

class Home extends Component {
    componentWillMount() {
        this.props.loadBoards();
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
        const {boards, activeBoards, pausedBoards, archivedBoards} = this.props;
        return (
            <div id="home">
                <header>
                    <div className="title">
                        <div className="logo"/>
                        <span>Minesweeper</span></div>
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
                            <h3>Active Games</h3>
                            {activeBoards.length !== 0 &&
                            <ul className="list-games">
                                {activeBoards.map((id) => (
                                    <li key={id}>
                                        <p><b>Id:</b>{id}</p>
                                        <p><b>Status:</b> {boards[id].status}</p>
                                        <p><b>Size:</b> {boards[id].rows} x {boards[id].columns}</p>
                                        <span className="created_at">Created {moment(boards[id].created_date).fromNow()}</span>
                                        <button onClick={() => this.onPlay(id)}>Play</button>
                                    </li>))
                                }
                                <div className="clear"/>
                            </ul>}
                            {activeBoards.length === 0 &&
                            <div className="empty-list">No active games.</div>}
                        </section>
                        <section>
                            <h3>Paused Games</h3>
                            {boards && boards.length !== 0 &&
                            <ul className="list-games">
                                {pausedBoards.map((id) => (
                                    <li key={id}>
                                        <p><b>Id:</b>{id}</p>
                                        <p><b>Status:</b> {boards[id].status}</p>
                                        <p><b>Size:</b> {boards[id].rows} x {boards[id].columns}</p>
                                        <span className="created_at">Created {moment(boards[id].created_date).fromNow()}</span>
                                        <button onClick={() => this.onResume(id)}>Resume</button>
                                    </li>))
                                }
                                <div className="clear"/>
                            </ul>}
                            {pausedBoards.length === 0 &&
                            <div className="empty-list">No paused games.</div>}
                        </section>
                        <section>
                            <h3>Archived Games</h3>
                            {boards && boards.length !== 0 &&
                            <ul className="list-games">
                                {archivedBoards.map((id) => (
                                    <li key={id}>
                                        <p><b>Id:</b>{id}</p>
                                        <p><b>Status:</b> {boards[id].status}</p>
                                        <p><b>Size:</b> {boards[id].rows} x {boards[id].columns}</p>
                                        {!!boards[id].result &&
                                        <b className={`board-${boards[id].result}`}>{boards[id].result}</b>}
                                        <span className="created_at">Created {moment(boards[id].created_date).fromNow()}</span>
                                        <button onClick={() => this.onResults(id)}>See results</button>
                                    </li>))
                                }
                                <div className="clear"/>
                            </ul>}
                            {archivedBoards.length === 0 &&
                            <div className="empty-list">No archived games.</div>}
                        </section>
                    </div>}
                </main>
            </div>
        );
    }
}

export default Home;
