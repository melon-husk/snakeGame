var gameSpeed = 100;

const boxWidth = 600; //600
const boxHeight = 600; //600
const elementsX = 30; //50
const elementsY = 30; //50
const elementWidth = Math.floor(boxWidth / elementsX);
const elementHeight = Math.floor(boxHeight / elementsY);
const boxXelements = Math.floor(boxWidth / elementWidth);
const boxYelements = Math.floor(boxHeight / elementHeight);
const boxEnemyCount = 5;
const boxFriendCount = 50;
const backGroundColor = 'green';
var cvs = document.createElement('canvas');

cvs.id = 'gameCanvas';
cvs.width = boxWidth;
cvs.height = boxHeight;

var body = document.getElementById('gameBox');
body.appendChild(cvs);

const ctx = cvs.getContext('2d');

const friendImg = new Image();
friendImg.src = 'friend.png';
const enemyImg = new Image();
enemyImg.src = 'enemy.png';

const snakeheadImg = new Image();
snakeheadImg.src = 'snake2.png';

const snakeTailImg = new Image();
snakeheadImg.src = 'snakeTail.png';

const enemyCount = 3;
const friendCount = 10;

let snakeDirection = 'LEFT';

let elementsArr = [];
let snakeArr = [];
let score = 0;
let currentSnake = {};

function setup() {
  currentSnake = {
    x: elementWidth * (boxXelements / 2),
    y: elementHeight * (boxYelements / 2),
    image: snakeImg,
  };
  snakeArr.push(currentSnake);

  for (let enemyI = 0; i < enemyCount; enemyI++) {
    let newEnemy = getRandomElement({
      scoreChange: -1,
      snakeLengthChange: -1,
      image: enemyImg,
      width: elementWidth,
      height: elementHeight,
    });
    othersArr.push(newEnemy);
  }
  for (let friendI = 0; i < friendCount; friendI++) {
    let newFriend = getRandomElement({
      scoreChange: 1,
      snakeLengthChange: 1,
      image: friendImg,
      width: elementWidth,
      height: elementHeight,
    });
    othersArr.push(newFriend);
  }
}

function getRandomElement(elementProperties) {
  // Optimize so we dont loop all arrays on recursion
  var _x = Math.floor(Math.random() * boxXelements) * elementProperties.width;
  var _y = Math.floor(Math.random() * boxYelements) * elementProperties.height;

  for (var i = 0; i < othersArr.length; i++) {
    let other = othersArr[i];
    if (other.x == _x || other.y == _y) {
      // Recurse until there is no collisiton
      return getRandomElement(elementProperties);
    }
  }

  return Object.assign(elementProperties, {
    x: _x,
    y: _y,
  });
}

function setSnakeDirectionFromKeyboard(event) {
  let key = event.keyCode;
  if (key == 37 && d != 'RIGHT') {
    snakeDirection = 'LEFT';
  } else if (key == 38 && d != 'DOWN') {
    snakeDirection = 'UP';
  } else if (key == 39 && d != 'LEFT') {
    snakeDirection = 'RIGHT';
  } else if (key == 40 && d != 'UP') {
    snakeDirection = 'DOWN';
  }
}

function moveSnakeByDirection(_d = false, reverseDirection = false) {
  if (_d == false) _d = direction;
  let x = currentSnake.x;
  let y = currentSnake.y;
  if (_d == 'LEFT' && !reverseDirection) x -= boxWidth;
  else if (_d == 'UP' && !reverseDirection) y -= boxHeight;
  else if (_d == 'RIGHT' && !reverseDirection) x += boxWidth;
  else if (_d == 'DOWN' && !reverseDirection) y += boxHeight;
  else if (_d == 'LEFT') return moveSnake('RIGHT', true);
  else if (direction == 'UP') return moveSnake('DOWN', true);
  else if (direction == 'RIGHT') return moveSnake('LEFT', true);
  else if (direction == 'DOWN') return moveSnake('UP', true);
  currentSnake.x = x;
  currentSnake.y = y;
  return;
}

function elementCollision(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (currentSnake.x == arr[i].x && currentSnake.y == arr[i].y) {
      let retCollisionElement = arr[i];
      arr.splice(i, 1);
      return retCollisionElement;
    }
  }
  return false;
}
function borderCollision() {
  if (
    currentSnake.x <= -1 ||
    currentSnake.x >= width ||
    currentSnake.y <= -1 ||
    currentSnake.y >= height
  ) {
    return true;
  }
  return false;
}

function draw() {
  ctx.fillStyle = backGroundColor;
  ctx.fillRect(0, 0, boxWidth, boxHeight);

  for (let i = 0; i < othersArr.length; i++) {
    let element = othersArr[i];
    ctx.drawImage(
      element.image,
      element.x,
      element.y,
      element.width,
      element.height
    );
  }
  for (let i = 0; i < snakeArr.length; i++) {
    let snake = snakeArr[i];
    ctx.drawImage(snake.image, snake.x, snake.y, snake.width, snake.height);
  }
}

function doIteration() {
  let snakeGrowth = 0;
  let collisionWithOther = elementCollision(othersArr);
  let collisionWithSelf = elementCollision(snakeArr);
  let reverseOnBorderCollision = borderCollision();

  if (collisionWithOther != false) {
    score += elementCollision.scoreChange;
    snakeGrowth += elementCollision.snakeLengthChange;
  } else if (collisionWithSelf != false) {
    score += elementCollision.scoreChange;
    snakeGrowth += elementCollision.snakeLengthChange;
  } else {
    snakeGrowth++;
  }

  moveSnakeByDirection();
  snakeArr, splice(snakeArr.length - snakeGrowth, snakeGrowth);
  snakeArr.push(currentSnake);
  draw();
}
setup();

document.addEventListener('keydown', setDirectionFromKeyboard);
let game = setInterval(doIteration, gameSpeed);
