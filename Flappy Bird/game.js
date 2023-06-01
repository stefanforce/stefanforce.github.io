
let board;
let boardWidth=360;
let boardHeight=640;
let context;

let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;

let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;

let pipeUpImg;
let pipeDownImg;
let pipeArray=[];

let bird= {
    x:birdX,
    y:birdY,
    width : birdWidth,
    height : birdHeight
}

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let gameOverCount =0;
let popupOpen=false;
var pipeInterval;

window.onload=function()
{
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./images/bird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }
    
    pipeUpImg = new Image();
    pipeUpImg.src="./images/pipeUp.png";
    pipeDownImg = new Image();
    pipeDownImg.src="./images/pipeDown.png";

    requestAnimationFrame(update);
    if(!popupOpen){
        pipeInterval = setInterval(placePipes, 1500);
    }
    
    
    document.addEventListener("keydown",moveBird);
    document.addEventListener("mousedown",moveBird);
    document.addEventListener("touchstart",moveBird);
}

let msPrev=window.performance.now()
const fps = 60
const msPerFrame = 1000/fps
let frames=0

function update(){
    if(gameOverCount==1){
        openMainPopup();
        return;
    }
    
    requestAnimationFrame(update);

    frames++;
    const msNow=window.performance.now()
    const msPassed=msNow-msPrev
    if(msPassed<msPerFrame) return

    const excessTime=msPassed%msPerFrame
    msPrev=msNow - excessTime


    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);

    velocityY +=gravity;
    bird.y = Math.max(bird.y + velocityY,0);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y > board.height) {
        gameOver = true;
        gameOverCount+=1
    }

    for(i=0;i < pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5 ;
            pipe.passed = true;
        }

        if(collision(bird,pipe)) {
            gameOver= true;
            gameOverCount+=1
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText("Score: "+score,5, 45);
 
    if(gameOver) {
        context.fillText("GAME OVER", 5, 90);
        context.font= "25px sans-serif";
        context.fillText("Press Space or Up-Arrow", 5, 125);
        context.fillText("to jump and start again", 5, 150);
    }
}

function placePipes(){
    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let opening = board.height/4;

    let pipeUp = {
        img : pipeUpImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    let pipeDown ={
        img: pipeDownImg,
        x : pipeX,
        y: randomPipeY + pipeHeight + opening,
        width : pipeWidth,
        height : pipeHeight,
        passed:false
    }

    pipeArray.push(pipeUp);
    pipeArray.push(pipeDown);
}


function moveBird(e) {
    if ((e.code === "Space" || e.code === "ArrowUp") || (e.type === "mousedown" && e.button === 0)) {
        velocityY=-6;
}
    else if (e.type === "touchstart") {
    velocityY = -6;
    }
    else return;
    if(gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function collision(bird,pipe){
    return bird.x < pipe.x + pipe.width &&   
           bird.x + bird.width > pipe.x &&   
           bird.y < pipe.y + pipe.height &&  
           bird.y + bird.height > pipe.y;    
}

function openMainPopup(){
                
    let popup = document.getElementById("popup");
    popupOpen=true;
    clearInterval(pipeInterval);
 
    popup.classList.add("open-popup");
}

function watchAd(){
    let popup = document.getElementById("popup");
    var video = document.getElementById('myVideo');
    var boardGame = document.getElementById('board-game');

    video.style.visibility='visible';
    popup.classList.remove("open-popup");
    boardGame.style.visibility='hidden';
      video.style.display = 'block';
      video.play();
      video.onended=function(){
        video.style.visibility='hidden';
        boardGame.style.visibility='visible';
        gameOverCount+=1;
        popupOpen=false;
        pipeInterval = setInterval(placePipes, 1500);
        requestAnimationFrame(update);
      }  
}

function closeMainPopUp(){
    let popup = document.getElementById("popup");
    popup.classList.remove("open-popup");
    gameOverCount+=1;
    popupOpen=false;
    pipeInterval = setInterval(placePipes, 1500);    
    requestAnimationFrame(update);
}

function emailPrompt(){
    let mainpopup = document.getElementById('mainpopup');
    mainpopup.style.display='none';
    let emailPopup = document.getElementById('EmailPopup');
    emailPopup.style.display='block';
}



setInterval(()=>{
    console.log(frames)
},1000)