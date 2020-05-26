var gameSpeed = 250;

const boxWidth = 600; //600
const boxHeight = 600; //600
const elementsX = 30; //50
const elementsY = 30; //50
const elementWidth = Math.floor(boxWidth / elementsX);
const elementHeight = Math.floor(boxHeight / elementsY);
const boxXelements = Math.floor(boxWidth / elementWidth);
const boxYelements = Math.floor(boxHeight / elementHeight);

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
snakeTailImg.src = 'snakeTail.png';

const enemyCount = 15;
const friendCount = 15;

let keyboardDirection = 'LEFT';

let elementsArr = [];
let snakeArr = [];
let score = 0;
let currentSnake = {};

function setup() {
  currentSnake = {
    x: elementWidth * (boxXelements / 2),
    y: elementHeight * (boxYelements / 2),
    image: snakeheadImg,
    width: elementWidth,
    height: elementHeight,
  };

  for (let enemyI = 0; enemyI < enemyCount; enemyI++) {
    let newEnemy = getRandomElement({
      scoreChange: -1,
      snakeLengthChange: -1,
      image: enemyImg,
      width: elementWidth,
      height: elementHeight,
    });
    elementsArr.push(newEnemy);
  }
  for (let friendI = 0; friendI < friendCount; friendI++) {
    let newFriend = getRandomElement({
      scoreChange: 1,
      snakeLengthChange: 1,
      image: friendImg,
      width: elementWidth,
      height: elementHeight,
    });
    elementsArr.push(newFriend);
  }
}

function getRandomElement(elementProperties) {
  // Optimize so we dont loop all arrays on recursion
  var _x = Math.floor(Math.random() * boxXelements) * elementProperties.width;
  var _y = Math.floor(Math.random() * boxYelements) * elementProperties.height;

  for (var i = 0; i < elementsArr.length; i++) {
    let other = elementsArr[i];
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
  if (key == 37 && keyboardDirection != 'RIGHT') {
    keyboardDirection = 'LEFT';
  } else if (key == 38 && keyboardDirection != 'DOWN') {
    keyboardDirection = 'UP';
  } else if (key == 39 && keyboardDirection != 'LEFT') {
    keyboardDirection = 'RIGHT';
  } else if (key == 40 && keyboardDirection != 'UP') {
    keyboardDirection = 'DOWN';
  }
}

function moveSnakeByDirection(reverseDirection = false) {
  let _d = keyboardDirection;
  if (_d == 'LEFT' && !reverseDirection) currentSnake.x -= elementWidth;
  else if (_d == 'UP' && !reverseDirection) currentSnake.y -= elementHeight;
  else if (_d == 'RIGHT' && !reverseDirection) currentSnake.x += elementWidth;
  else if (_d == 'DOWN' && !reverseDirection) currentSnake.y += elementHeight;
  else if (_d == 'LEFT') {
    currentSnake.x += elementWidth;
    keyboardDirection = 'RIGHT';
  } else if (_d == 'UP') {
    currentSnake.y += elementHeight;
    keyboardDirection = 'DOWN';
  } else if (_d == 'RIGHT') {
    currentSnake.x -= elementWidth;
    keyboardDirection = 'LEFT';
  } else if (_d == 'DOWN') {
    currentSnake.y -= elementHeight;
    keyboardDirection = 'UP';
  }
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
    currentSnake.x <= 0 ||
    currentSnake.x >= boxWidth ||
    currentSnake.y <= 0 ||
    currentSnake.y >= boxHeight
  ) {
    return true;
  }
  return false;
}

function draw() {
  ctx.fillStyle = backGroundColor;
  ctx.fillRect(0, 0, boxWidth, boxHeight);
  ctx.drawImage(
    currentSnake.image,
    currentSnake.x,
    currentSnake.y,
    currentSnake.width,
    currentSnake.height
  );
  for (let i = 0; i < elementsArr.length; i++) {
    let element = elementsArr[i];
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
  ctx.font = '30px Arial';
  ctx.strokeText('Score: ' + score, 10, 50);
}
let snakeLengthWaiting = 0;
let initialSnake = true;
function doIteration() {
  let collisionWithOther = elementCollision(elementsArr);
  let collisionWithSelf = elementCollision(snakeArr);
  let reverseOnBorderCollision = borderCollision();

  if (collisionWithOther != false) {
    score += collisionWithOther.scoreChange;
    snakeLengthWaiting += collisionWithOther.snakeLengthChange;
  } else if (collisionWithSelf != false) {
    score += collisionWithSelf.scoreChange;
    snakeLengthWaiting += collisionWithSelf.snakeLengthChange;
  }

  if (snakeLengthWaiting < 0) {
    const decreaseLength = -snakeLengthWaiting;
    snakeArr.splice(snakeArr.length - decreaseLength-1, decreaseLength);
    snakeLengthWaiting = 0;
  } else if (snakeLengthWaiting > 0) {
    const increaseLength = snakeLengthWaiting;
    snakeLengthWaiting -= increaseLength;
  } else {
    snakeArr.pop();
  }

  let newSnakeHead = {
    x: currentSnake.x,
    y: currentSnake.y,
    image: snakeTailImg,
    width: currentSnake.width,
    height: currentSnake.height,
  };

  snakeArr.unshift(newSnakeHead);

  moveSnakeByDirection(reverseOnBorderCollision);

  draw();
}

setup();

document.addEventListener('keydown', setSnakeDirectionFromKeyboard);
let game = setInterval(doIteration, gameSpeed);
