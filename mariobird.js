//Board


let board;
let boardWidth = 552;
let boardHeight = 792;
let context;

//mario 
 let marioWidth = 50;
 let marioHeight = 40;
 let mariox = boardWidth/8;
 let marioy = boardHeight/2;
 let marioIMG;

 let mario = {
    x : mariox,
    y : marioy,
    width : marioWidth,
    height : marioHeight

 }

 //Pipes

 let pipeArray = [];
 let pipeWidth = 64;
 let pipeHeight = 512;
 let pipeX = boardWidth; // Top right of the screen
 let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Physics 
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;


let gameover = false;
let score = 0;


window.onload = function(){
    board = document.getElementById("board") // This is the ID in HTML
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // Used for drawing 

    //Drawing Mario on Canvas
    //context.fillStyle = "green";
    //context.fillRect(mario.x,mario.y,mario.width,mario.height);

    //Load Mario IMG
    marioIMG = new Image();
    marioIMG.src = "./mariofly.png";
    marioIMG.onload = function(){
        context.drawImage(marioIMG, mario.x,mario.y,mario.width,mario.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "lowpipe.png";

    requestAnimationFrame(update);

    setInterval(placePipes, 1500); //Every 1.5 secs
    document.addEventListener("keydown", moveBird);

}

function update(){
    requestAnimationFrame(update);
    if (gameover){
        return;
    }
    context.clearRect(0,0, board.width,board.height);

    //Mario 
    velocityY += gravity;
    //mario.y += velocityY;
    mario.y = Math.max(mario.y + velocityY,0);
    context.drawImage(marioIMG, mario.x,mario.y,mario.width,mario.height);

    if(mario.y > board.height){
        gameover = true;
    }

    //Pipes
    for(let i =0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y,pipe.width, pipe.height);

        if (!pipe.passed && mario.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(mario,pipe)){
            gameover = true;
        }
    
    }


    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); //Removes first element from the page
    }
    //Score
    context.fillStyle = "white";
    context.font="45px New Super Mario Font U";
    context.fillText(score, 5, 45);
     
    if (gameover){
        context.fillText("GAME OVER",130,300);
    }
    
}


function placePipes(){
    if (gameover){
        return;
    }
    //(0-1) * pipeHeight/2

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);

}

function moveBird(e){
    if( e.code =="Space" || e.code == "ArrowUp"){
        //Jump
        velocityY = -6;

        //Reset Game
        if(gameover){
            mario.y = marioy;
            pipeArray = [];
            score = 0;
            gameover = false;

        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
     

}