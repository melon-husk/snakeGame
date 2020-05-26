var gameSpeed = 250;

const boxWidth = 600;
const boxHeight = 600;
const elementsX = 50;
const elementsY = 50;
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
const borderCollisionScoreChange = -5;
const borderCollisionLengthChange = -1;
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
    lengthChange: 0,
    scoreChange: 0,
  };

  for (let enemyI = 0; enemyI < enemyCount; enemyI++) {
    let newEnemy = getRandomElement({
      scoreChange: -1,
      lengthChange: -1,
      image: enemyImg,
      width: elementWidth,
      height: elementHeight,
      x: 0,
      y: 0,
    });
    elementsArr.push(newEnemy);
  }
  for (let friendI = 0; friendI < friendCount; friendI++) {
    let newFriend = getRandomElement({
      scoreChange: 1,
      lengthChange: 1,
      image: friendImg,
      width: elementWidth,
      height: elementHeight,
      x: 0,
      y: 0,
    });
    elementsArr.push(newFriend);
  }
}

function getRandomElement(elementProperties, iterateOptimize = 0) {
  var _x = Math.floor(Math.random() * boxXelements) * elementProperties.width;
  var _y = Math.floor(Math.random() * boxYelements) * elementProperties.height;

  for (var i = iterateOptimize; i < elementsArr.length; i++) {
    let other = elementsArr[i];
    if (other.x == _x || other.y == _y) {
      // Recurse until there is no collisiton
      return getRandomElement(elementProperties, i);
    }
  }

  return Object.assign(elementProperties, {
    x: _x,
    y: _y,
  });
}

function setSnakeDirectionFromKeyboard(event) {
  let key = event.keyCode;
  if (key == 37) {
    keyboardDirection = 'LEFT';
  } else if (key == 38) {
    keyboardDirection = 'UP';
  } else if (key == 39) {
    keyboardDirection = 'RIGHT';
  } else if (key == 40) {
    keyboardDirection = 'DOWN';
  }
}

function moveSnakeByDirection(collisionBorder = false) {
  const _d = keyboardDirection;

  if (_d == 'LEFT' && collisionBorder == 'LEFT') {
    currentSnake.x += elementWidth;
    keyboardDirection = 'RIGHT';
  } else if (_d == 'UP' && collisionBorder == 'UP') {
    currentSnake.y += elementHeight;
    keyboardDirection = 'DOWN';
  } else if (_d == 'RIGHT' && collisionBorder == 'RIGHT') {
    currentSnake.x -= elementWidth;
    keyboardDirection = 'LEFT';
  } else if (_d == 'DOWN' && collisionBorder == 'DOWN') {
    currentSnake.y -= elementHeight;
    keyboardDirection = 'UP';
  } else if (_d == 'DOWN' && collisionBorder == 'LEFTDOWN') {
    currentSnake.y -= elementHeight;
    keyboardDirection = 'UP';
  } else if (_d == 'UP' && collisionBorder == 'LEFTUP') {
    currentSnake.y += elementHeight;
    keyboardDirection = 'DOWN';
  } else if (_d == 'LEFT' && collisionBorder == 'LEFTUP') {
    currentSnake.x += elementWidth;
    keyboardDirection = 'RIGHT';
  } else if (_d == 'LEFT' && collisionBorder == 'LEFTDOWN') {
    currentSnake.x += elementWidth;
    keyboardDirection = 'RIGHT';
  } else if (_d == 'RIGHT' && collisionBorder == 'RIGHTDOWN') {
    currentSnake.x -= elementWidth;
    keyboardDirection = 'LEFT';
  } else if (_d == 'DOWN' && collisionBorder == 'RIGHTDOWN') {
    currentSnake.y -= elementHeight;
    keyboardDirection = 'UP';
  } else if (_d == 'UP' && collisionBorder == 'RIGHTUP') {
    currentSnake.y += elementHeight;
    keyboardDirection = 'DOWN';
  } else if (_d == 'RIGHT' && collisionBorder == 'RIGHTUP') {
    currentSnake.x -= elementWidth;
    keyboardDirection = 'LEFT';
  } else if (_d == 'LEFT') currentSnake.x -= elementWidth;
  else if (_d == 'UP') currentSnake.y -= elementHeight;
  else if (_d == 'RIGHT') currentSnake.x += elementWidth;
  else if (_d == 'DOWN') currentSnake.y += elementHeight;
  if (keyboardDirection != _d) {
    console.log('direction', _d, 'newDirection',keyboardDirection,'collisionBorder', collisionBorder);
  }
}

function elementCollision(cSnake, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (cSnake.x == arr[i].x && cSnake.y == arr[i].y) {
      let collisionElement = arr[i];
      arr.splice(i, 1);
      return collisionElement;
    }
  }
  return false;
}
function borderCollision(cSnake) {
  let border = '';
  if (cSnake.x < elementWidth) {
    border += 'LEFT';
  }
  if (cSnake.x >= elementWidth * (boxXelements - 1)) {
    border += 'RIGHT';
  }
  if (cSnake.y < elementHeight) {
    border += 'UP';
  }
  if (cSnake.y >= elementHeight * (boxYelements - 1)) {
    border += 'DOWN';
  }
  if (border.length != 0) return border;

  return false;
}

function draw() {
  ctx.fillStyle = backGroundColor;
  ctx.fillRect(0, 0, boxWidth, boxHeight);

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
  ctx.font = '30px Arial';
  ctx.strokeText('waiting: ' + snakeLengthWaiting, 50, 100);
  ctx.font = '30px Arial';
  ctx.strokeText('direction: ' + keyboardDirection, 150, 150);
  ctx.font = '30px Arial';
  ctx.strokeText('borderCol: ' + debugBorderColision, 250, 190);
  ctx.drawImage(
    currentSnake.image,
    currentSnake.x,
    currentSnake.y,
    currentSnake.width,
    currentSnake.height
  );
}

let snakeLengthWaiting = 0;
let debugBorderColision = '';

function doIteration() {
  let addHead = false;
  const lastSnake = {
    x: currentSnake.x,
    y: currentSnake.y,
    image: currentSnake.image,
    width: currentSnake.width,
    height: currentSnake.height,
    lengthChange: currentSnake.lengthChange,
    scoreChange: currentSnake.scoreChange,
  };

  const collisionWithOther = elementCollision(lastSnake, elementsArr);
  const collisionWithSelf = elementCollision(lastSnake, snakeArr);
  const collisionBorder = borderCollision(lastSnake);
  const reverseDirection = collisionBorder != false;

  debugBorderColision = collisionBorder;
  if (collisionWithOther != false) {
    score += collisionWithOther.scoreChange;
    snakeLengthWaiting += collisionWithOther.lengthChange;
  } else if (collisionWithSelf != false) {
    score += collisionWithSelf.scoreChange;
    snakeLengthWaiting += collisionWithSelf.lengthChange;
  } else if (reverseDirection) {
    score += borderCollisionScoreChange;
    snakeLengthWaiting += borderCollisionLengthChange;
  }

  if (snakeLengthWaiting < 0) {
    snakeArr.splice(snakeLengthWaiting - 1);
    snakeLengthWaiting = 0;
  } else if (snakeLengthWaiting > 0) {
    snakeLengthWaiting -= snakeLengthWaiting;
    addHead = true;
  } else if (snakeArr.length > 0) {
    snakeArr.pop();
  }

  let newSnakeHead = {
    x: lastSnake.x,
    y: lastSnake.y,
    image: snakeTailImg,
    width: lastSnake.width,
    height: lastSnake.height,
    lengthChange: lastSnake.lengthChange,
    scoreChange: lastSnake.scoreChange,
  };

  moveSnakeByDirection(collisionBorder);

  snakeArr.unshift(newSnakeHead);

  draw();
}

setup();

document.addEventListener('keydown', setSnakeDirectionFromKeyboard);
let game = setInterval(doIteration, gameSpeed);
