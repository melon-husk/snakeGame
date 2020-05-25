var gameSpeed = 100;

const boxWidth = 600; //600
const boxHeight = 600; //600
const elementsX = 30; //50
const elementsY = 30; //50
const elementWidth = Math.floor (boxWidth / elementsX);
const elementHeight = Math.floor (boxHeight / elementsY);
const boxXelements = Math.floor (boxWidth / elementWidth);
const boxYelements = Math.floor (boxHeight / elementHeight);
const boxEnemyCount = 5;
const boxFriendCount = 50;
const backGroundColor = 'green';
var cvs = document.createElement ('canvas');

cvs.id = 'gameCanvas';
cvs.width = boxWidth;
cvs.height = boxHeight;

var body = document.getElementById ('gameBox');
body.appendChild (cvs);

const ctx = cvs.getContext ('2d');

const friendImg = new Image ();
friendImg.src = 'friend.png';
const enemyImg = new Image ();
enemyImg.src = 'enemy.png';

const snakeheadImg = new Image ();
snakeheadImg.src = 'snake2.png';

let snake = [];

snake[0] = {
  x: elementWidth * (boxXelements / 2),
  y: elementHeight * (boxYelements / 2),
};

function createFriend () {
  var _x = Math.floor (Math.random () * boxXelements) * elementWidth;
  var _y = Math.floor (Math.random () * boxYelements) * elementHeight;

  var match = false;

  for (var i = 0; i < snake.length; i++) {
    tail = snake[i];
    if (tail.x == _x || tail.y == _y) {
      match = true;
    }
  }

  if (match) {
    return createFriend ();
  }

  return {
    x: _x,
    y: _y,
  };
}

function getNewElement () {
  var _x = Math.floor (Math.random () * boxXelements) * elementWidth;
  var _y = Math.floor (Math.random () * boxYelements) * elementHeight;

  return {
    x: _x,
    y: _y,
  };
}
// create the friend
let friends = [];
for (let i = 0; i < boxFriendCount; i++) {
  friends.push (createFriend ());
}

// create the enemy

let enemy = getNewElement ();

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener ('keydown', direction);

function direction (event) {
  let key = event.keyCode;
  if (key == 37 && d != 'RIGHT') {
    d = 'LEFT';
  } else if (key == 38 && d != 'DOWN') {
    d = 'UP';
  } else if (key == 39 && d != 'LEFT') {
    d = 'RIGHT';
  } else if (key == 40 && d != 'UP') {
    d = 'DOWN';
  }
}

// cheack collision function
function collision (head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      array.splice (i, 1);
      return true;
    }
  }
  return false;
}
//everything to the canvas
const enemies = 3;

ctx.fillStyle = backGroundColor;
ctx.fillRect (0, 0, boxWidth, boxHeight);
function draw (recursive = false, isFriend = null) {
  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;


  for (let i = 1; i < snake.length; i++) {
    ctx.fillStyle = 'blue';
    ctx.fillRect (snake[i].x, snake[i].y, elementWidth, elementHeight);

    ctx.strokeStyle = 'red';
    ctx.strokeRect (snake[i].x, snake[i].y, elementWidth, elementHeight);
  }
  ctx.drawImage (
    snakeheadImg,
    snake[0].x,
    snake[0].y,
    elementWidth,
    elementHeight
  );

  for (let i = 0; i < friends.length; i++) {
    ctx.drawImage (
      friendImg,
      friends[i].x,
      friends[i].y,
      elementWidth,
      elementHeight
    );
  }

  ctx.drawImage (enemyImg, enemy.x, enemy.y, elementWidth, elementHeight);

  // which direction
  if (d == 'LEFT') snakeX -= elementWidth;
  if (d == 'UP') snakeY -= elementHeight;
  if (d == 'RIGHT') snakeX += elementWidth;
  if (d == 'DOWN') snakeY += elementHeight;
  if (d == 'A') snakeX -= elementWidth;
  if (d == 'W') snakeY -= elementHeight;
  if (d == 'D') snakeX += elementWidth;
  if (d == 'S') snakeY += elementHeight;
  let foundfriend = false;
  let foundenemy = false;
  // if the snake eats the friend
  if (collision ({x: snakeX, y: snakeY}, friends)) {
    score = score + 2;
    //friends.push(friend);
    let friend = createFriend ();
    friends.push (friend);
    foundfriend = true;

    // we don't remove the tail
  } else if (snakeX == enemy.x && snakeY == enemy.y) {
    // if the snake eats the enemy
    // Check Enemies vector for current position
    score = score - 2;

    enemy = getNewElement ();

    foundenemy = true;
    snake.pop ();
    snake.pop ();

    // we don't remove the tail
  } else {
    if (!recursive && isFriend == null) {
      snake.pop ();
    } else if (recursive && !isFriend) {
      snake.pop ();
    }
  }

  // add new Head

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // game over
  // adding GAME OVER, refresh the page!

  if (
    snakeX <= -1 ||
    snakeX >= boxWidth ||
    snakeY <= -1 ||
    snakeY >= boxHeight
  ) {
    //f(snakeX <= 0 || snakeX >= boxWidth|| snakeY <= 0|| snakeY >= boxHeight || collision(newHead,snake)){

    // clearInterval(game);
    // snake.clear();
    gameSpeed = 100;

    //snake respawn in center on canvas
    //    snake = [];
    //    snake[0] = {
    //        x: elementWidth * (boxXelements / 2),
    //        y: elementHeight * (boxYelements / 2)
    //    };

    ctx.strokeText ('GAME OVER ', 10, 50);

    score = 0;

    return;
  }

  snake.unshift (newHead);

  if (foundfriend) {
    draw (true, true);
  } else if (foundenemy) {
    draw (true, false);
  }

  ctx.font = '30px Arial';
  ctx.strokeText ('Score: ' + score, 10, 50);

  if (score >= 10) {
    gameSpeed = 50;
    //   clearInterval(game);
    //   game = setInterval(draw, gameSpeed);
  } else if (score >= 30) {
    gameSpeed = 80;
    //  clearInterval(game);
    //  game = setInterval(draw, gameSpeed);
  } else if (score >= 40) {
    gameSpeed = 70;
    // clearInterval(game);
    // game = setInterval(draw, gameSpeed);
  } else if (score >= 50) {
    gameSpeed = 60;
    //  clearInterval(game);
    //game = setInterval(draw, gameSpeed);
  } else if (score >= 60) {
    gameSpeed = 50;
    // clearInterval(game);
    //  game = setInterval(draw, gameSpeed);
  } else if (score >= 70) {
    gameSpeed = 40;
    // clearInterval(game);
    //game = setInterval(draw, gameSpeed);
  }
  clearInterval (game);
  game = setInterval (draw, gameSpeed);
}

// call draw function every 100 ms

let game = setInterval (draw, gameSpeed);
