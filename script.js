var gameSpeed = 100;

const boxWidth = 600;
const boxHeight = 600;
const elementsX = 100;
const elementsY = 100;
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

const enemyCount = 100;
const enemyScoreChange = -10;
const enemyLengthChange = -3;

const friendCount = 500;
const friendScoreChange = 3;
const friendLengthChange = 5;

const selfScoreChange = -1;
const selfLengthChange = 0;

const borderCollisionScoreChange = -1;
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
    lengthChange: selfLengthChange,
    scoreChange: selfScoreChange,
  };

  for (let enemyI = 0; enemyI < enemyCount; enemyI++) {
    let newEnemy = getRandomElement({
      scoreChange: enemyScoreChange,
      lengthChange: enemyLengthChange,
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
      scoreChange: friendScoreChange,
      lengthChange: friendLengthChange,
      image: friendImg,
      width: elementWidth,
      height: elementHeight,
      x: 0,
      y: 0,
    });
    elementsArr.push(newFriend);
  }
}
function getRandomCoordinates(elementProperties) {
  return {
    x: Math.floor(Math.random() * boxXelements) * elementProperties.width,
    y: Math.floor(Math.random() * boxYelements) * elementProperties.height,
  };
}

function getRandomElement(elementProperties) {
  let randomCoordinates = getRandomCoordinates(elementProperties);
  let match = false;
  for (var i = 0; i < elementsArr.length; i++) {
    let other = elementsArr[i];
    if (other.x == randomCoordinates.x && other.y == randomCoordinates.y) {
      randomCoordinates = getRandomCoordinates(elementProperties);
      i = 0;
    }
  }

  return Object.assign(elementProperties, {
    x: randomCoordinates.x,
    y: randomCoordinates.y,
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
}

function elementCollision(cSnake, arr, removeCollisionElement = true) {
  for (let i = 0; i < arr.length; i++) {
    if (cSnake.x == arr[i].x && cSnake.y == arr[i].y) {
      let collisionElement = arr[i];
      if (removeCollisionElement) {
        arr.splice(i, 1);
      }
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

  ctx.drawImage(
    currentSnake.image,
    currentSnake.x,
    currentSnake.y,
    currentSnake.width,
    currentSnake.height
  );
}

let snakeLengthWaiting = 0;

function doIteration() {
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
  const collisionWithSelf = elementCollision(lastSnake, snakeArr, false);
  const collisionBorder = borderCollision(lastSnake);

  if (collisionWithOther != false) {
    score += collisionWithOther.scoreChange;
    snakeLengthWaiting += collisionWithOther.lengthChange;
  } else if (collisionWithSelf != false) {
    score += collisionWithSelf.scoreChange;
    snakeLengthWaiting += collisionWithSelf.lengthChange;
  } else if (collisionBorder != false) {
    score += borderCollisionScoreChange;
    snakeLengthWaiting += borderCollisionLengthChange;
  }

  if (snakeLengthWaiting < 0) {
    snakeArr.splice(snakeLengthWaiting - 1);
    snakeLengthWaiting = 0;
  } else if (snakeLengthWaiting > 0) {
    snakeLengthWaiting--;
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
