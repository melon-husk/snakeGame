class canvasGame {
  gameSpeed = 100;
  boxWidth = 600;
  boxHeight = 600;
  elementsX = 30;
  elementsY = 30;
  elementWidth = Math.floor(boxWidth / elementsX);
  elementHeight = Math.floor(boxHeight / elementsY);
  boxXelements = Math.floor(boxWidth / elementWidth);
  boxYelements = Math.floor(boxHeight / elementHeight);
  backGroundColor = 'green';

  snakeDirection = 'LEFT';

  elementsArr = [];
  score = 0;
  currentSnake = {};

  constructor(boxWidth,boxHeight) {
    currentSnake = {
      x: this.elementWidth * (this.boxXelements / 2),
      y: this.elementHeight * (this.boxYelements / 2),
      image: this.snakeImg,
    };

    for (let enemyI = 0; i < this.enemyCount; enemyI++) {
      let newEnemy = this.getRandomElement(
        othersArr,
        {
          scoreChange: -1,
          snakeLengthChange: -1,
          image: this.enemyImg,
          width: this.elementWidth,
          height: this.elementHeight,
        },
        this.boxXelements,
        this.boxYelements,
        this.elementWidth,
        this.elementHeight
      );
      this.othersArr.push(newEnemy);
    }
    for (let friendI = 0; i < this.friendCount; friendI++) {
      let newFriend =this.getRandomElement(
        this.othersArr,
        {
          scoreChange: 1,
          snakeLengthChange: 1,
          image: this.friendImg,
          width: this.elementWidth,
          height: this.elementHeight,
        },
        this.boxXelements,
        this.boxYelements,
        this.lementWidth,
        this.elementHeight
      );
      this.othersArr.push(newFriend);
    }
  }
}
