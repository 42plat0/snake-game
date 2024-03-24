const gameBoard = document.querySelector("#game-board")
let c = gameBoard.getContext("2d");
const blockSize = 20;
const rows = 20;
const cols = 20;
let lastKey;
let gameSpeed = 100;
let snake;
let food;

let gameOverMessage = "Game Over!"


class Entity {
    constructor(x, y){
        this.x = x;
        this.y = y;

        this.headX = this.x * blockSize;
        this.headY = this.y * blockSize;
    }
}

class Snake extends Entity{
    constructor(x, y, velocity, direction){
        super(x, y)
        this.velocity = velocity;
        this.direction = direction;

        this.size = [];
        this.inBound = true;
        this.eatItself = false;
    }
    draw(){
        c.fillStyle = "red"
        c.fillRect(this.headX, this.headY, blockSize, blockSize)
        //with snake moving push its coordinates into an array
        this.size.push([this.headX, this.headY])
    }
    outOfBounds(){
        if (this.headX > gameBoard.width || this.headX < 0
            || this.headY > gameBoard.height || this.headY < 0){
                this.inBound = false;
        }
    }
    ateItself(){
            for(let i = 0; i < this.size.length; i++){
                if(this.headX == this.size[i][0] && this.headY == this.size[i][1]){
                    this.eatItself = true;
                }  
                }
        
    }
    redraw(){
        c.fillStyle = "black"
        c.fillRect(this.size[0][0], this.size[0][1], blockSize, blockSize)    
    }
    move(){
        //gives new coordinates everytime snake moves
        this.control();
        this.outOfBounds()
        if(this.size.length > 1){
            this.ateItself()
            //when snake has eaten, remove first element from array when moved
            //then move snake
            //then redraw
            //shift again
            this.size.shift();
        }
        //draws snake
        this.draw();

        //redraws snake
        this.redraw();

        if (this.headX == food.positionOnBoardX && this.headY == food.positionOnBoardY){
            food.reposition()
            //update snake coordinate array
            this.size.push([this.headX, this.headY])
            gameSpeed -= 3;
        }
    }
    control(){
        switch (this.direction){
            case "up":
                this.velocity = -1;
                this.headY += this.velocity * blockSize;
                break;
            case "down":
                this.velocity = 1;
                this.headY += this.velocity * blockSize;
                break;
            case "right":
                this.velocity = 1;
                this.headX += this.velocity * blockSize;
                break;
            case "left":
                this.velocity = -1;
                this.headX += this.velocity * blockSize;
                break;
            default:
                break;
        }
    }
}

class Food extends Entity{
    constructor(x, y){
        super(x,y)
    }
    randomisePosition(){
        this.positionOnBoardX = Math.floor(Math.random() * cols) * blockSize;
        this.positionOnBoardY = Math.floor(Math.random() * rows) * blockSize;
    }
    draw(){
        this.randomisePosition()
        c.fillStyle = 'white'
        c.fillRect(food.positionOnBoardX, food.positionOnBoardY, blockSize, blockSize)   
    }
    reposition(){
        this.draw();
    }
}

function newGame(){
    gameBoard.height = rows * blockSize
    gameBoard.width = cols * blockSize
    c.fillRect(0, 0, gameBoard.height, gameBoard.width)
    snake = new Snake (10, 10, 0, "up");
    food = new Food()
    gameSpeed = 100;
    food.draw();
}
function game (){
    newGame()
    setInterval(()=>{
        snake.move();
        if (!snake.inBound || snake.eatItself){
            alert(gameOverMessage)
            newGame()
        }
    }, gameSpeed);
}
document.addEventListener("keydown", (e)=>{
    switch(e.key){
        case "ArrowUp":
            if(lastKey != "ArrowDown"){
                lastKey = 'ArrowUp'
                snake.direction = "up";
            }
            break;
        case "ArrowLeft":
            if(lastKey != "ArrowRight"){
                lastKey = 'ArrowLeft'
                snake.direction = "left";
            }
            break;
        case "ArrowRight":
            if(lastKey != "ArrowLeft"){
                lastKey = 'ArrowRight'
                snake.direction = "right";
            }
            break;
        case "ArrowDown":
            if(lastKey != "ArrowUp"){
                lastKey = 'ArrowDown'
                snake.direction = "down";
            }
            break;
        default:
            break;
    }

})

game();