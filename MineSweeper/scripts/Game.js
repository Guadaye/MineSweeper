'use strict';

import Minefield from"./Minefield.js"

const DEFAULT_SIZE = 15;
const MINE_COUNT =15;
let CLEARED_SQUARE = 0;
let gameOver = false;
let seconds = 0;
let minutes = 0;
let hours = 0;
let timerStopped = false;
let interval = null;

export default class Game{
    constructor(size = DEFAULT_SIZE){
        //Create a game
  
        $('.game-over').hide();
        $('.game-win').hide();
        this.board={
            size: size,
        };

        const config1 = {
            formats:["mp3"],
            preload:true,
            autoplay:false,
            loop:false,
        }

       this.clickSound= new buzz.sound("./audio/click",config1);
       this.rightClickSound= new buzz.sound("./audio/rightClick",config1);
        this.gameOverSound = new buzz.sound("./audio/gameOver", config1)
        this.minefield = new Minefield(size, MINE_COUNT);
        console.log(this.minefield);
        this.gameOver=false;

        this.message = "Welcome to mine sweeper"       
        this.generateBoard();
        this.updateCellHandlers();
    }

    get MAP_SIZE(){ return DEFAULT_SIZE}
    get MINE_COUNT(){return MINE_COUNT}

    updateCellHandlers(){

        $(".play-now-btn").on('click', event=>{ 
            console.log("CLICKED"); 
            interval = window.setInterval(this.stopWatch,1000);
            $('.splash-screen').hide();
          this.clickSound.play();
        }) 

        $(".square").on('contextmenu', event=>{
            
            event.preventDefault();
  
            console.log("right click");
            const $theE2 = this.getElementFromEvent(event);

            const row = $theE2.data("row");     //figue out which row and col it is in
            const col = $theE2.data("col");
            const selectedSquare = this.minefield.squareAt(row, col);   

            const id = `square-${row}-${col}`;
            const $innerDiv = $(`#${id}`);
            if (selectedSquare.isFlagged ==false&& gameOver==false)
            {
                this.rightClickSound.play();
                $innerDiv.removeClass(`show-indicator`);
                $innerDiv.addClass(`flag`);
        //    $innerDiv.prepend('<img id="flag" src="/image/flag.png" />')
            selectedSquare.isFlagged = true;
            }
            
            else
            {   
            $innerDiv.removeClass(`show-indicator`);       
            $innerDiv.removeClass(`flag`);
          //  $innerDiv.remove();​         
            $innerDiv.addClass(`square`);
            selectedSquare.isFlagged = false;           
            }
        });

        $(".square").on('click', event=>{ 
            
            if (gameOver==false){


                this.clickSound.play();
                CLEARED_SQUARE= 0;
                //handle the user clicking one of the game map squares
                
                //get the click from html element.
                const $theE1 = this.getElementFromEvent(event);

                const row = $theE1.data("row");     //figue out which row and col it is in
                const col = $theE1.data("col");
                console.log(`clicked cell at${row}, ${col}`);
                const selectedSquare = this.minefield.squareAt(row, col);   

                //let the square object get the data from html, now we have a selected square.                    

                //check if there is a mine here
                //If mine Boom! GameOver
                if (selectedSquare.isFlagged==false)
                {
                    if (selectedSquare.hasMine == true)
                        {                          
                            this.gameOverFunction();                            
                        }
                    else{                       
                        console.log('test:'+selectedSquare.adjacentMines);

                        //If no mine are there, adjacentmines?if so show the count
                        //Else clear all non adjacent mine squares(0 adjacent)

                        if (selectedSquare.hasAdjacent()){                 
                            const count = selectedSquare.adjacentMines;
                            const $innerDiv = $(`<div>${count}</div>`);     //add a new div inside with number in it
                            $innerDiv.addClass(`color-${count}`);           //add a style for the adjacent mine
                            $theE1.html($innerDiv);
                        }
                        this.clear(row, col);
                    
                        this.checkIfWin();
                    }
                } 
            }   
            //let assert = true;
        });     
    }

checkIfWin(){
    if (gameOver==false)
    {
    //check how many squares are cleared 
        for (let i = 0; i< this.board.size; i++){                  
            for (let j =0; j<this.board.size; j++){
                //Loop through all the square , if each square is cleared, keep searching.
                if(this.minefield.squareAt(i,j).isCleared )
                {                       
                CLEARED_SQUARE++;
                }
            }
        }
    //if squares with no mine are all cleared, win the game.
    console.log("CLEARD_SQUARE"+CLEARED_SQUARE);
    if (CLEARED_SQUARE== DEFAULT_SIZE*DEFAULT_SIZE-MINE_COUNT){                                      
            this.winGameFunction();
        }
    }
}


    stopWatch(){
        seconds++;
        if(seconds/60 ===1){
            seconds = 0;
            minutes++;
            if (minutes/60===1){
                minutes = 0;
                hours++;
            }
        }
        document.getElementById("timer").innerHTML = "TIME: "+hours+":"+minutes+":"+seconds;
    }

    stopWatchStop(){
        window.clearInterval(interval);       
    }

    gameOverFunction(){
        for (let i = 0; i< this.board.size; i++)
        {      
            for (let j =0; j<this.board.size; j++){
                //Loop through all the square , if each square is cleared, keep searching.
                if(this.minefield.squareAt(i,j).isCleared )
                {                   
                    continue;
                }
                //if it is not cleared, change the background color
                else{
                    const id = `square-${i}-${j}`;
                    const $innerDiv = $(`#${id}`);
                    $innerDiv.addClass(`show-indicator`);
                    
                    
                //if this square is a mine, show bomb.
                    if (this.minefield.squareAt(i,j).hasMine)
                    {
                        $innerDiv.addClass(`bomb`);
                        $innerDiv.append('<img id="bomb" src="/image/bomb.png" />')
                    }
                }
            }
        }
        //pop out game over window.
        $('.game-over').show();     
        gameOver=true; 
        this.gameOverSound.play();
        this.stopWatchStop(); 
    }

    winGameFunction(){
        console.log("wingame");
        $('.game-win').show();
        gameOver=true;  

    }

    getElementFromEvent(event){
   
    const $theE1 = $(event.target); // theE1 is the thing got clicked
    const id = $theE1.attr("id");        
    $theE1.addClass("show-indicator")
        return $theE1
    }

    clear(row, col)
    {   //clear the current square.
        let row_range = [row - 1, row , row + 1];
        let col_range = [col - 1, col, col + 1];
        const id = `square-${row}-${col}`;
        const $innerDiv = $(`#${id}`);
        $innerDiv.addClass(`show-indicator`);
        this.minefield.squareAt(row,col).isCleared = true;
        //loop through 8 squares around the selected square.
        for (let row_index = 0; row_index < row_range.length; row_index++){
            for (let col_index = 0; col_index < col_range.length; col_index++){

                //if there are squares outside the map range, ignore those
                if (row_range[row_index] < 0 || row_range[row_index] >= this.board.size || col_range[col_index] < 0 || col_range[col_index] >= this.board.size){
                    continue;
                }

                //find the 8 object around the clicked object.
                const neighbourSquare = this.minefield.squareAt(row_range[row_index], col_range[col_index]);
                //if there are objects that is already cleared, ignore those.
                if (neighbourSquare.isCleared){
                    continue;
                }
                //if neighbour has bomb, resume this for-loop 
                                
                if (neighbourSquare.hasMine == true){
                    continue;
                }
                // find the 8 neighbour's square element in HTML, and turn their background into white.
                const id = `square-${row_range[row_index]}-${col_range[col_index]}`;   
                const $temp_square_div = $(`#${id}`);     //add a new div inside with number in it
                $temp_square_div.addClass(`show-indicator`);  
                neighbourSquare.isCleared = true;
                              
                
                //if the neighbour square's neighbour square has mine, add number to the neighbour square.
                if (neighbourSquare.hasAdjacent() == true)
                {   
                    if (neighbourSquare.isFlagged==false)
                    {
                    const count = neighbourSquare.adjacentMines;
                    const $innerDiv = $(`<div>${count}</div>`);     //add a new div inside with number in it
                    $innerDiv.addClass(`color-${count}`);
                    $temp_square_div.html($innerDiv);
                    }
                    else
                    {
                        continue;
                    }
                }

                // if neighbour square doesnt has mine around it, keep doing this to the clicked square's neighbour.
                else{
                    this.clear(row_range[row_index], col_range[col_index]);
                }
            }
        }
    }

    run( ){      
        while(!this.gameOver){
            this.update();
            this.render();
        }               
    }

    update(){
        //get user input and updates the game simulation
//        this.updateCellHandlers();
        this.gameOver = true;
    }
    render(){
        //change the DOM and the screen to show the player what is going on
        //generate the playfield
       // this.generateBoard();
    }

    generateBoard(){
        let markup ="<table>";
        for(let row= 0; row <this.board.size; row++){
            markup += "<tr>";
            for (let col = 0; col<this.board.size; col++){
                const id = `square-${row}-${col}`;   //"square-4-5"
                const dataAttributes = `data-row ="${row}" data-col = "${col}"`;
                markup +=`<td><div id ="${id}" class ="square" ${dataAttributes}><div class = "unknown"></div></td>`;
            }
            markup +="</tr>";
        }

        markup += "</table>";
    
        document.querySelector("#game-screen").innerHTML = markup;
        $("#game-screen").css({"display": "flex"});
        $("#game-screen").css({"justify-content": "center"});
        
        
       
    }
}