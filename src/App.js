import Astar from './Astar.js';
import Board from './Board.js';

class App {
    constructor($target){
        this.board = new Board($target);
    }
}

new App(document.getElementById('app'));

