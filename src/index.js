import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

  function BoardRow(props) {
    return (
      <div className={props.className}>
        {props.value}
      </div>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick = {() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      let board = Array(3);
      for(let i = 0; i < 3; i++) {
        let squares = Array(3);
        for(let j = i * 3; j < (i * 3) + 3; j++) {
          squares.push(this.renderSquare(j));
        }
        board.push(<BoardRow value={squares} className="board-row"></BoardRow>);
      }

      return board;
    }
  }

  function MovesSortToggle(props) {
    return (
      <div>
        <button onClick={props.onClick}>{'Sort moves'}</button>
        <span className={props.ascClass}> ASC</span>
        <span> / </span>
        <span className={props.descClass}>DESC</span>
      </div>
    );
  }

  function Move(props) {
    const desc = props.move ?
      `Go to move #${props.move} (row: ${props.step.lastPosition.row}, col: ${props.step.lastPosition.col})` :
      'Go to game start';

    return (
      <li>
        <button
          className={props.className}
          onClick={props.onClick}>
          {desc}
        </button>
      </li>
    );
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          lastPosition: {}
        }],
        sortOrder: 'ASC',
        activeMove: -1,
        stepNumber: 0,
        xIsNext: true
      };
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const moves = history.map((step, move) => 
        <Move key={move} className={this.tryAddActiveClass(move)} move={move} step={step} onClick={() => this.jumpTo(move)}></Move>
      );
      const winner = calculateWinner(current.squares);
      let status;
      if(winner) {
        status = `Winner: ${winner}`;
      } else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <MovesSortToggle
              ascClass={this.getClassBasedOnSortOrder('ASC')}
              descClass={this.getClassBasedOnSortOrder('DESC')}
              onClick={() => this.sortMoves()}>
            </MovesSortToggle>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }

    tryAddActiveClass(move) {
      if(this.state.activeMove === move) {
        return 'active';
      }
    }

    jumpTo(step) {
      this.setState({
        activeMove: step,
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if(calculateWinner(squares) || squares[i]) {
        return;
      }
      const xIsNext = this.state.xIsNext;
      squares[i] = xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          lastPosition: {
            row: Math.floor(i / 3),
            col: i < 3 ? i : Math.floor(i % 3)
          },
        }]),
        activeMove: history.length,
        stepNumber: history.length,
        xIsNext: !xIsNext});
    }

    getClassBasedOnSortOrder(sortOrder) {
      return this.state.sortOrder === sortOrder ? 'active' : 'inactive'
    }

    sortMoves() {
      this.setState({
        sortOrder: this.state.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      });
    }


  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  