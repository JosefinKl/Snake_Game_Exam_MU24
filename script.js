console.log("JavaScript-filen är kopplad!");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const poisonImg = new Image();
poisonImg.src = "poison.png";
poisonImg.onload = () => {
  console.log("Poison-bilden laddad!");
};

const appleImg = new Image();
appleImg.src = "apple.png";
appleImg.onload = () => {
  console.log("Apple-bilden laddad!");
};

const birdImg = new Image();
birdImg.src = "bird.png";
birdImg.onload = () => {
  console.log("Fågel-bilden laddad!");
};


const gridSize = 20;          //size of one box
const tileCount = 20;        // number of boxes per row/coloumn
const poisonSize = 40 + Math.sin(Date.now() / 200) * 3;



let running = true;
let gameSpeed = 300;
let snake = [{ x: tileCount/2, y: tileCount/2 }]; // start in the midle of the canvas
let dx = 1;  // movement
let dy = 0;  // movement


document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp")    { dx = 0; dy = -1; }
  if (e.key === "ArrowDown")  { dx = 0; dy = 1; }
  if (e.key === "ArrowLeft")  { dx = -1; dy = 0; }
  if (e.key === "ArrowRight") { dx = 1; dy = 0; }
});


//Food
function foodPosition() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

let food = foodPosition();

//Poison
function poisonPosition() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

let poison = poisonPosition();
let bird = null;
let birdActive = false;

//Poison and food not in same place
if(poison.x === food.x && poison.y === food.y){
    poison = poisonPosition();
}


let newPoisonPosition = false;

function gameLoop() {
  if (!running) return;

  update();
  draw();

  if(Math.random() < 0.01){
    newPoisonPosition = true;
  }

  if(newPoisonPosition){
      poison = poisonPosition();
      newPoisonPosition = false;
    }
  
    // Adjust speed dynamically
    if(snake.length > 12){
        gameSpeed = 50;
        
    } else if(snake.length > 8){
        gameSpeed = 100;
    } else if(snake.length > 4){
        gameSpeed = 200;
    } else {
        gameSpeed = 300;
    }
    setTimeout(gameLoop, gameSpeed);

    
  
}

function update() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  snake.unshift(head); // new head position of the snake

  
    if (head.x === food.x && head.y === food.y){
        food = foodPosition();
        if (poison.x === food.x && poison.y === food.y) {
            poison = poisonPosition();
        }
        
    }else if (head.x === poison.x && head.y === poison.y) {
        gameOver();
        
    }else{
        snake.pop();

    }

    if (head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
        ) {
            gameOver();
        
        }

    // Bird attack
    if (!birdActive && Math.random() < 0.1) {
      birdActive = true;

      bird = {
        x: -2, // starta utanför vänster sida
        y: Math.floor(Math.random() * tileCount),
        speed: 0.2 + Math.random() * 0.3
      };
    }

    if (birdActive) {
      bird.x += bird.speed;

      // Remove bird when outside game box
      if (bird.x > tileCount + 2) {
        birdActive = false;
        bird = null;
        return
      }

      // Hit snake
      if (Math.floor(bird.x) === snake[0].x && bird.y === snake[0].y) {
        alert("Bird eats you");
        gameOver();
      }
    }

        // Check if snake hits itself, but not the head.
    if (snake.length > 1) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
        }
    }
}
           
}

function gameOver(){
    console.log("förlora");
            running = false;
            alert("Game Over!");

             // reset snake
            snake = [{ x: tileCount/2, y: tileCount/2 }];

            // reset bird
            birdActive = false;
            bird = null;
            running = true;

}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  //empty the canvas

  ctx.fillStyle = "green";
  
  for (let part of snake) {
    ctx.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize,
      gridSize
    );
  }

 

    const foodSize = 40;

    ctx.drawImage(
        appleImg,
        food.x * gridSize - (foodSize - gridSize) / 2,
        food.y * gridSize - (foodSize - gridSize) / 2,
        foodSize,
        foodSize
        );
    

    const poisonSize = 40 + Math.sin(Date.now() / 100) * 5;
    
    ctx.drawImage(
        poisonImg,
        poison.x * gridSize - (poisonSize - gridSize) / 2,
        poison.y * gridSize - (poisonSize - gridSize) / 2,
        poisonSize,
        poisonSize
        );

    const birdSize = 40;

    if(birdActive){
      ctx.drawImage(
        birdImg,
        bird.x*gridSize-(birdSize - gridSize) / 2,
        bird.y * gridSize - (birdSize - gridSize) / 2,
        birdSize,
        birdSize
      );
    }



}


setTimeout(gameLoop, gameSpeed);


