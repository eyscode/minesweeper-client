import React, {Component} from 'react';
import './CreateBoardForm.css';

class CreateBoardForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 10,
            columns: 10,
            mines: 10
        };
    }

    render() {
        return (
            <div id="create-board-form">
                <div>
                    <label>Number of rows:</label>
                    <input type="number" name="rows" value={this.state.rows}
                           onChange={this.handleChange.bind(this, 'rows')}/>
                </div>
                <div>
                    <label>Number of columns:</label>
                    <input type="number" name="columns" value={this.state.columns}
                           onChange={this.handleChange.bind(this, 'columns')}/>
                </div>
                <div>
                    <label>Number of mines:</label>
                    <input type="number" name="mines" value={this.state.mines}
                           onChange={this.handleChange.bind(this, 'mines')} onKeyPress={(ev) => this.handleEnter(ev)}/>
                </div>
                <button disabled={!this.allFieldsAreValid()}
                        onClick={() => this.allFieldsAreValid() && this.props.createBoard(this.state.rows, this.state.columns, this.state.mines)}>Create
                </button>
            </div>
        );
    }

    allFieldsAreValid() {
        return [this.state.rows, this.state.columns, this.state.mines].every(f => !!f && f !== ' ');
    }

    handleEnter(ev) {
        if (["enter", "Enter"].includes(ev.key) && this.allFieldsAreValid()) {
            this.props.createBoard(this.state.rows, this.state.columns, this.state.mines);
        }
    }

    handleChange(field, event) {
        this.setState({[field]: event.target.value});
    }
}

export default CreateBoardForm;
