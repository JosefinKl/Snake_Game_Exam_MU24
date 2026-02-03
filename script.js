console.log("JavaScript-filen är kopplad!");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


const gridSize = 20;          //size of one box
const tileCount = 20;        // number of boxes per row/coloumn

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



function gameLoop() {
  update();
  draw();
  
  
}

function update() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  snake.unshift(head); // new head position of the snake

  
    if (head.x === food.x && head.y === food.y){
        food = foodPosition();
        
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
            clearInterval(game); // stoppa spelet
            alert("Game Over!");
            snake = [{ x: tileCount/2, y: tileCount/2 }];

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

  ctx.fillStyle = "red";
  
  
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize,
        gridSize
);

}





setInterval(gameLoop, 300); //set snake speed. Change to lower to get a faster snake. 
