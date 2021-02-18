'use strict';

import Square from "./Square.js";

export default class Minefield{

    constructor(size = 10, mineCount = 10){
        this.size = size;
        this.field = []; //turn this into a 2d array of squares.

        //initialize the minefield with empty squares
        this._init();
        //init minefield with n mines(randomize)
        this._randomizeMines(mineCount);
        //tell all the sqaures to compute adjacent mines
        this._countAdjacent();
    }

 get SIZE(){return this.size}
 
    _init(){
    // create 2d array of squares
        for (let i = 0; i< this.size; i++)
        {
        this.field[i]= [];
            for (let j =0; j<this.size; j++){
                this.field[i][j]= new Square();
        }
        }
    }

    squareAt(row, col){
        //go find the square at row col and return it
        return this.field[row][col];
    }

    _randomizeMines(mineCount){
        //for each mine, randomize row, column
        while(mineCount){
            //set a random number within board size for col/row.
            let temp_row = Math.floor((Math.random() * this.size));
            let temp_col = Math.floor((Math.random() * this.size));

            //set a square with random col/row number to has mine.
            let temp_hasMine = this.squareAt(temp_row, temp_col).hasMine;

            //chedk if this mine has already been set, if so, get another random square, 
            while(temp_hasMine==true){
                temp_row = Math.floor((Math.random() * this.size));
                temp_col = Math.floor((Math.random() * this.size));
                temp_hasMine = this.squareAt(temp_row, temp_col).hasMine;
            }

            //successful set the mine, let goal number mine -1 till it reach to 0.
            this.squareAt(temp_row, temp_col).hasMine = true;
            mineCount -= 1;
        }      
    }

    _countAdjacent(){
        //TODO:walk through field, for each square count adjacent          
        for (let i = 0; i< this.size; i++)
        {
            for (let j =0; j<this.size; j++){

                //make a bool, let every square object check if it has mine.
                let temp_hasMine = this.squareAt(i, j).hasMine;

                //for those square who has mine:
                if (temp_hasMine)
                {   
                    //set this square's neighbour square's row/col range
                    let row_range = [i - 1, i , i + 1];
                    let col_range = [j - 1, j, j + 1];

                    //start looping through each square's neighbour square
                    for (let row_index = 0; row_index < row_range.length; row_index++){
                        for (let col_index = 0; col_index < col_range.length; col_index++){

                            // if neighbour square is out of the map, ignore them .
                            if (row_range[row_index] < 0 || row_range[row_index] >= this.size || col_range[col_index] < 0 || col_range[col_index] >= this.size || ( row_range[row_index] == i && col_range[col_index] == j)){
                                continue;
                            }

                            //if they are not out of the map, loop through its neighbour and check 
                            let temp_square = this.squareAt(row_range[row_index], col_range[col_index]);
                            //increase this square's adjacentmine number.
                            temp_square.adjacentMines += 1;
                            
                        }
                    }
                }
            }       
        }    
    }
}