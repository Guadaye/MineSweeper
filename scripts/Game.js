'use strict';


export default class Game{
    constructor(){
        this.board={
            size:15,
        };
        this.gameOver=false;
        
    }
    run( ){
        
        while(this.gameOver){
            this.update();
            this.render();
        }               
    }

    update(){
        //get user input and updates the game simulation

        this.gameOver = true;
    }
    render(){
        //change the DOM and the screen to show the player what is going on
        //generate the playfield
        this.generateBoard();
    }

    generateBoard(){
        let markup ="<table>";
        for(let row= 0; row <this.board.size; row++){
            markup += "<tr>";
            for (let col = 0; col<this.board.size; col++){
                markup +="<td><td/>";
            }
            markup +="</tr>";
        }

        markup += "</table>";
    
        document.querySelector("#game-screen").innerHTML = markup;


    }
}