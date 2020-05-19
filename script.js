const boxWidth = 600;
const boxHeight = 300;
const elementsX = 50;
const elementsY = 50;
const elementWidth = Math.floor(boxWidth / elementsX);
const elementHeight = Math.floor(boxHeight / elementsY);
const boxXelements = Math.floor(boxWidth / elementWidth);
const boxYelements = Math.floor(boxHeight / elementHeight);
const boxEnemyCount = 5;
const boxFriendCount = 10;
const backGroundColor = "red";
var cvs = document.createElement('canvas');

cvs.id = "gameCanvas";
cvs.width = boxWidth;
cvs.height = boxHeight;
cvs.style.border = "1px solid";
cvs.style.display = "block";
cvs.style.margin = "0px 0px 0px 0px"; // cvs.style.margin = "0 auto";
cvs.style.background = backGroundColor;
cvs.style.padding = "0px";
var body = document.getElementById("gameBox");
body.appendChild(cvs);

const ctx = cvs.getContext("2d");

          
const friendImg = new Image();
friendImg.src = "friend.png";
const enemyImg = new Image();
enemyImg.src = "enemy.png";

let snake = [];

snake[0] = {
    x : elementWidth*(boxXelements/2),
    y : elementHeight*(boxYelements/2)
};

function getNewElement(){
    return{
        x : Math.floor(Math.random()*boxXelements)* elementWidth,
        y : Math.floor(Math.random()*boxYelements)*elementHeight
    };
}
// create the friend
let friends= [];
for(let i = 0; i < boxFriendCount; i++){
    friends.push( getNewElement());
}
// create the enemy

let enemy = getNewElement();

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener("keydown",direction);

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
    }
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas
const enemies=3;
function draw(recursive=false,isFriend=null){
// old head position
let snakeX = snake[0].x;    
let snakeY = snake[0].y;
    
    ctx.fillStyle = backGroundColor;
    ctx.fillRect(0, 0, boxWidth, boxHeight);

    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,elementWidth,elementHeight);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,elementWidth,elementHeight);
    }

    for( let i = 0; i < friends.length ; i++){
        ctx.drawImage(friendImg, friends[i].x, friends[i].y,elementWidth,elementHeight);
    }

    ctx.drawImage(enemyImg, enemy.x, enemy.y,elementWidth,elementHeight);    
    

    // which direction
    if( d == "LEFT") snakeX -= elementWidth;
    if( d == "UP") snakeY -= elementHeight;
    if( d == "RIGHT") snakeX += elementWidth;
    if( d == "DOWN") snakeY += elementHeight;     
    if( d == "A") snakeX -= elementWidth;
    if( d == "W") snakeY -= elementHeight;
    if( d == "D") snakeX += elementWidth;
    if( d == "S") snakeY += elementHeight;
    let foundfriend = false;
    let foundenemy= false;
    // if the snake eats the friend
    if( collision({x:snakeX,y:snakeY},friends)){
        score=score+1;
        //friends.push(friend);
        let friend = getNewElement();
        friends.push(friend);
        foundfriend=true;
        // we don't remove the tail
    }
    // if the snake eats the enemy
    else if(snakeX == enemy.x && snakeY == enemy.y){ // Check Enemies vector for current position
        score=score-1;

        enemy =getNewElement();
        
        foundenemy=true;
        snake.pop(); 
        snake.pop(); 

        // we don't remove the tail
    }else{ 
        if(!recursive && isFriend == null){
            snake.pop(); 
    }   else if(recursive && !isFriend){
            snake.pop(); 

        }
    }

    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // game over
    //console.log(snakeY);
    if(snakeX < 0 || snakeX >= boxWidth|| snakeY < 0|| snakeY >= boxHeight || collision(newHead,snake)){
        
        
        console.log(newHead);
        clearInterval(game);
        return;
    }
    
    snake.unshift(newHead);
    
    if(foundfriend){
           draw(true,true);
    }else if(foundenemy){
            draw(true,false);
    }   
            
    // Create grid
     
   /*
   
   for (i = 0; i < boxWidth; i += elementWidth) {
        ctx.moveTo(0, i);
        ctx.lineTo(boxWidth, i);
        ctx.stroke();
    }

    for (i = 0; i <boxHeight; i += elementHeight) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i,boxHeight);
        ctx.stroke();
    }
    
    */
}

// call draw function every 100 ms

let game = setInterval(draw,100);


















