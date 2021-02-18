'use strict';
export default class AudioManager{

constructor(){
    const config1 = {
        formats:["mp3"],
        preload:true,
        autoplay:false,
        loop:false,
    }

    this.clickSound= new buzz.sound("./audio/click",config1);
    this.rightClickSound= new buzz.sound("./audio/rightClick",config1);
    this.gameOverSound = new buzz.sound("./audio/gameOver", config1);
}


}