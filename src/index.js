    
    import React, { } from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import { Container, Row, Col, Button, Radio, Form  } from 'react-bootstrap';
    
    const coordinates = [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, 
        {x:2, y:1}, {x:2, y:2}, {x:2, y:3},
        {x:3, y:1}, {x:3, y:2}, {x:3, y:3}];

    function Square(props){
        return(
            <button 
                className={props.className}
                onClick={props.onClick}
            >
                {props.value}
            </button>
        );
    }
  
    class Board extends React.Component {

        renderSquare(i) {
            return (
                <Square 
                    value={this.props.squares[i]}
                    className={'square ' + ((Number(this.props.x) === Number(i) && this.props.x != null) ? this.props.classSquare : '')}
                    onClick={() => this.props.onClick(i)}
                />
            );
        }
    
        render() {
            return (
                <div ref={this.key} className={"board-container "+this.props.className}>
                    <div className="board-row">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
            );
        }
    }
  
    class Game extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                initial: {
                    squares: ['', '1', '2', '3', '4', '5', '6', '7', '8'],
                    x: null,
                    classSquare: 'selected', 
                },
                meta: {
                    squares: ['', '1', '2', '3', '4', '5', '6', '7', '8'],
                    x: null,
                    classSquare: 'selected', 
                },
                history: [{
                    squares:  ['', '1', '2', '3', '4', '5', '6', '7', '8'],
                    empty: 0,
                    level: 0,
                    parent: -1,
                    f: 0,
                }],
                expanded: [],
                selected: [0],
            };
        }

        handleClickInitial(i){
            const current = this.state.initial.squares;
            const squares = current.slice();
            if(squares[i] !== '' && this.state.initial.x === null){
                this.setState({
                    initial: {
                        x: i,
                        squares: squares,
                        classSquare: this.state.initial.classSquare,
                    },
                });
            }else if(this.state.initial.x !== null){
                const squareAux = squares[i];
                let empty = this.state.history[this.state.history.length -1].empty;
                if(2===1){//squares[i] || notNeighbor(i, this.state.initial.x)){
                    this.setState({
                        initial: {
                            x: this.state.initial.x,
                            squares: squares,
                            classSquare: 'error',
                        },
                    });

                    setTimeout(() => this.resetClassInitial(), 500);
                }else{
                    squares[i] = squares[this.state.initial.x];
                    squares[this.state.initial.x] = squareAux;
                    if(squareAux === "") empty = this.state.initial.x;
                    this.setState({
                        initial: {
                            squares: squares,
                            x: null,
                            classSquare: this.state.initial.classSquare,
                        },
                        history: [{
                            squares: squares,
                            empty: empty,
                            level: 0,
                            parent: -1,
                            f: 0,
                        }],
                        expanded: [],
                        selected: [0],
                    });
                }
                
            } 
        }

        resetClassInitial(){
            this.setState({
                initial: {
                    squares: this.state.initial.squares,
                    x: null,
                    classSquare: 'selected',
                }
            });
        }

        handleClickMeta(i){
            const current = this.state.meta.squares;
            const squares = current.slice();
            if(squares[i] !== '' && this.state.meta.x === null){
                this.setState({
                    meta: {
                        x: i,
                        squares: squares,
                        classSquare: this.state.meta.classSquare,
                    },
                });
            }else if(this.state.meta.x !== null){
                const squareAux = squares[i];
                if(2===1){//squares[i] || notNeighbor(i, this.state.meta.x)){
                    this.setState({
                        meta: {
                            x: this.state.meta.x,
                            squares: squares,
                            classSquare: 'error',
                        },
                    });

                    setTimeout(() => this.resetClassMeta(), 500);
                }else{
                    squares[i] = squares[this.state.meta.x];
                    squares[this.state.meta.x] = squareAux;
                    this.setState({
                        meta: {
                            squares: squares,
                            x: null,
                            classSquare: this.state.meta.classSquare,
                        },
                    });
                }
                
            } 
        }

        resetClassMeta(){
            this.setState({
                meta: {
                    squares: this.state.meta.squares,
                    x: null,
                    classSquare: 'selected',
                }
            });
        }

        jumpTo(step) {
            this.setState({
                stepNumber: step,
                xIsNext: (step % 2) === 0,
            });
        }

        solveRiddle(){
            const final = this.checkMeta();
            if(final === false){
                document.getElementsByClassName('board-container selected')[document.getElementsByClassName('board-container selected').length - 1].scrollIntoView();
                this.nextStep();
            }else{
                this.selectResult(final);
                alert("FINALIZADO");
            }
        }

        selectResult(final){
            const history = this.state.history;
            let result = [final];
            let parent = history[final].parent;

            while(parent !== -1){
                result.push(parent);
                parent = history[parent].parent;
            }

            this.setState( {
                selected: result,
            });
        }

        nextStep(){
            if(!this.checkMeta()){
                const history = this.state.history;
                const expanded = this.state.expanded;
                let newEntries = [];
                let notSelected = [];
                let selected = this.getSelectedBoard(notSelected);
                
                do{
                    let legalMoves = [];
                    if(history[selected].empty + 1 < 9 && history[selected].empty + 1 > -1 && Math.ceil((history[selected].empty + 1) / 3)  === Math.ceil((history[selected].empty + 2) / 3)){
                        legalMoves.push(history[selected].empty + 1);
                    }
                    if(history[selected].empty - 1 < 9 && history[selected].empty - 1 > -1 && Math.ceil((history[selected].empty + 1) / 3)  === Math.ceil((history[selected].empty) / 3)){
                        legalMoves.push(history[selected].empty - 1);
                    }
                    if(history[selected].empty + 3 < 9 && history[selected].empty + 3 > -1){
                        legalMoves.push(history[selected].empty + 3);
                    }
                    if(history[selected].empty - 3 < 9 && history[selected].empty - 3 > -1){
                        legalMoves.push(history[selected].empty - 3);
                    }

                    for(let s = 0; s < legalMoves.length; s++){
                        
                        const squares = history[selected].squares.slice();
                        const squareAux = squares[history[selected].empty];
                    
                        squares[history[selected].empty] = squares[legalMoves[s]];
                        squares[legalMoves[s]] = squareAux;
                        
                        if(!expanded.includes(selected)){
                            if(!this.isReturn(squares)){
                                newEntries.push({
                                    squares: squares,
                                    empty: legalMoves[s],
                                    level: history[selected].level + 1,
                                    parent: selected,
                                    f: this.calculateManhattanDistance(squares, history[selected].level + 1)
                                });
                            }
                        }
                    }

                    if(newEntries.length === 0) {
                        notSelected.push(selected);
                        selected = this.getSelectedBoard(notSelected);
                    }
                }while (newEntries.length === 0);
                
                

                this.setState(
                    {
                        history: history.concat(newEntries),
                        expanded: expanded.concat(selected),
                        selected: [selected],
                    },
                    () => {if(document.getElementById('auto-mode').checked) setTimeout(() => this.solveRiddle(), 1)},
                );
            }
            
        }

        isReturn(squares){
            const history = this.state.history;

            for(let i = 0; i < history.length; i++){
                if(JSON.stringify(history[i].squares) === JSON.stringify(squares)) {
                    return true;
                }
            }
            return false;
        }

        getSelectedBoard(notSelected){
            let board;
            let currentF = 0;
            const history = this.state.history;
            const expanded = this.state.expanded;

            for(let i = 0; i < history.length; i++){
                
                if(!expanded.includes(i) && !notSelected.includes(i) && (history[i].f < currentF || currentF === 0) ) {
                    currentF = history[i].f;
                    board = i;
                }
            }

            return board;
        }

        calculateManhattanDistance(current, level){
            const meta = this.state.meta.squares;
            let f = level;
            let distances = Array(9).fill(0);


            for(let i = 0; i < meta.length; i++){
                    if(meta[i] !== current[i] && current[i] !== ""){
                        f += 1; 
                    }

                    for(let s = 0; s < meta.length; s++){
                        if(meta[s] === current[i] && meta[s] !== ""){
                            const value = Math.abs(coordinates[s].x-coordinates[i].x) + Math.abs(coordinates[s].y-coordinates[i].y);
                            distances[i] = value;
                            f += value * value * value;
                            
                            /*if(i + 1 < 9 && i + 1 > -1 && Math.ceil((i + 1) / 3)  === Math.ceil((i + 2) / 3) && current[i + 1] === ""){
                                f -= value;
                            }
                            if(i - 1 < 9 && i - 1 > -1 && Math.ceil((i + 1) / 3)  === Math.ceil((i) / 3) && current[i -  1] === ""){
                                f -= value;
                            }
                            if(i + 3 < 9 && i + 3 > -1  && current[i + 3] === ""){
                                f -= value;
                            }
                            if(i - 3 < 9 && i - 3 > -1  && current[i - 3] === ""){
                                f -= value;
                            }*/
                        }
                        
                    }
                
            }
            console.log(distances);

            f += (distances[0] + distances[2] + distances[6] + distances[8]) - (distances[1] + distances[3] + distances[4] + distances[5] + distances[7]);


            return f;
              
        }

        checkMeta(){
            const history = this.state.history;
            const selected = this.state.selected[0];
            const current = history[selected].squares;
            const meta = this.state.meta.squares;
            const equals = JSON.stringify(current) === JSON.stringify(meta);

            if(equals){
                return selected;
            }else{
                return false;
            }    
              

        }

        handleClickFilter(){
            const selected = this.state.selected;
            this.setState(
                {
                    selected: selected,
                }
            );
        }

        render() {
            const history = this.state.history;

            const moves = history.map((step, move) => {
                
                return (
                    <Col 
                        key={move} 
                        md="auto"
                        className={ ((!this.state.selected.includes(move) && this.state.selected.length > 1) && (document.getElementById('res-moves') !== null && document.getElementById('res-moves').checked)) ? ' board-hide' : ''}>

                        <div className="game-info">
                            <div>ID={move}</div>
                            <div>PADRE={(history[move].parent === -1) ? 'Raíz' : history[move].parent}</div>
                            <div>F´={history[move].f}</div>
                            <div>NIVEL={history[move].level}</div>
                        </div>

                        <Board 
                            x={null}
                            key={move} 
                            squares={history[move].squares}
                            className={((this.state.selected.includes(move)) ? 'selected' : '')  }
                            classSquare={''}
                            onClick={() => {}}
                        />

                    </Col>
                );
            });

            return (
                <Container fluid className="game">
                    <Row>
                        <Col md="auto" className="game-board">
                            <div className="game-info">
                                <div>Configure el estado inicial</div>
                            </div>
                            <Board 
                                x={this.state.initial.x}
                                squares={this.state.initial.squares}
                                classSquare={this.state.initial.classSquare}
                                onClick={(i) => this.handleClickInitial(i)}
                            />
                        </Col>

                        <Col md="auto" className="game-board">
                            <div className="game-info">
                                <div>Configure el estado meta</div>
                            </div>
                            <Board 
                                x={this.state.meta.x}
                                squares={this.state.meta.squares}
                                classSquare={this.state.meta.classSquare}
                                onClick={(i) => this.handleClickMeta(i)}
                            />
                        </Col>

                        <Col md="auto" className="game-board">
                            <Button onClick={() => this.solveRiddle()} >Ejecutar</Button>
                        </Col>

                        <Col md="auto" className="game-board">
                            <Form.Check
                             type='radio'
                             name="view"
                             label={`Mostrar todos los movimientos analizados`}
                             id={`all-moves`}
                             onClick={() => this.handleClickFilter()}
                            />

                            <Form.Check
                             type='radio'
                             name="view"
                             label={`Mostrar solo movimientos de la solución`}
                             id={`res-moves`}
                             onClick={() => this.handleClickFilter()}
                            />
                        </Col>

                        <Col md="auto" className="game-board">
                            <Form.Check
                             type='checkbox'
                             name="mode"
                             label={`Modo automatico`}
                             id={`auto-mode`}
                            />
                        </Col>
                    </Row>

                    
                    <Row className="game-boards">
                        {moves}
                    </Row>
                </Container>
            );
        }
    }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  document.getElementById('res-moves').checked = true;

  document.addEventListener('keydown', event => {
      if(event.key === 'Enter'){
        document.getElementById('auto-mode').checked = !document.getElementById('auto-mode').checked;
      }
  });
  

  function notNeighbor(x, y){
    if((y === x + 1 && Math.ceil((y+1) / 3)  === Math.ceil((x+1) / 3)) ||(y === x - 1 && Math.ceil((y+1) / 3) === Math.ceil((x+1) / 3)) || y === x + 3 || y === x - 3 ){
        return false;
    }

    return true;
  }