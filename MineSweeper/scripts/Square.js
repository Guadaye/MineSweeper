'use strict';

export default class Square{

    constructor(){
    this.hasMine = false;
    this.adjacentMines = 0;
    this.isCleared = false;
    this.isFlagged = false;
 //   this.location  
    this.mine = null;  //new Mine();
    }

    
    hasAdjacent(){
        if (this.adjacentMines){
            return true;
        }
        else{
            return false;
        }
    }

//    get hasMine(){
//         return this._hasMine
//     }
}