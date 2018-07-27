var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var HEIGHT = window.innerHeight / 2, WIDTH = window.innerWidth / 2;
var MARGIN = 20               // Bottom margin
var BOTTOM = HEIGHT - MARGIN; // y-coordinate of the floor

canvas.height = HEIGHT;
canvas.width = WIDTH;

window.addEventListener('resize', function(){
    HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
});

window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        window.setTimeout(callback, 1000 / 60));
    }();


//arrow keys
var LEFT = 37, SPACE = 32, RIGHT = 39;

document.onkeydown = function(e){
    switch (e.keyCode){
        case LEFT:
            GAME.player.moveLeft();
            break;
        case RIGHT:
            GAME.player.moveRight();
            break;
        case SPACE:
            GAME.player.jump();
            break;
    }
}

document.onkeyup = function(e){
    switch (e.keyCode){
        case LEFT:
        case RIGHT:
            GAME.player.stop();
            break;
    }
}

// Global game state
var GAME = new Game();

// Global constants
const gravity = .4;

// Objects 
function Player(){
    this.size = 20;
    this.speed = 10;
    this.inputBuffer = [];

    this.x = Math.random() * WIDTH;
    this.y = BOTTOM - this.size;
    this.yvel = 0;
    this.numJumps = 0;


    this.moveRight = function(){
        var lastInput = this.inputBuffer[this.inputBuffer.length - 1];
        if (lastInput != this.speed)
            this.inputBuffer.push(this.speed);
    }
    
    this.moveLeft = function(){
        var lastInput = this.inputBuffer[this.inputBuffer.length - 1];
        if (lastInput != -this.speed)
            this.inputBuffer.push(-this.speed);
    }

    this.stop = function(){
        this.inputBuffer.splice(0, 1);
    }

    this.jump = function(){
        if (this.numJumps < 2){
            this.yvel = this.speed;
            this.numJumps++;
        }
    }

    this.land = function(platform){
        var land = platform.y;
        var thickness = platform.dy;

        if (this.y + this.size > land && 
                this.y < land + thickness){
            this.y = land - this.size;
            this.numJumps = 0;
            this.yvel = 0;
        }
    }

    this.bounceVert = function(platform){
        this.yvel = 0;
        this.y = platform.y + platform.dy;
    }

    this.bounceRight = function(platform){
        this.xvel = 0;
        this.x = platform.x + platform.dx
    }

    this.bounceLeft = function(platform){
        this.xvel = 0;
        this.x = platform.x - this.size;
    }

    this.move = function(){
        var xvel = this.inputBuffer[0] || 0;
        this.x += xvel;
        this.y -= this.yvel;
        
        // Apply gravity
        if (this.y + this.size < BOTTOM)
            this.yvel -= gravity;
    }

    this.draw = function(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function Platform(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    this.draw = function(){
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, dx, dy);
    }
}


function Game(){
    this.player = new Player();
    this.platforms = initializePlatforms();

    function initializePlatforms(){
        var platforms = [];
        var ground = new Platform(0, BOTTOM, WIDTH, MARGIN);
        var raised = new Platform(WIDTH/4, HEIGHT/2, WIDTH/2, HEIGHT/2);
        platforms.push(ground);
        platforms.push(raised);
        return platforms
    }

    this.detectCollisions = function(){
        for (var i = 0; i < this.platforms.length; i++){
            var platform = this.platforms[i];

            if (this.player.x + this.player.size > platform.x && 
                this.player.x < platform.x + platform.dx &&
                this.player.y + this.player.size > platform.y &&
                this.player.y < platform.y)
            this.player.land(platform);

            else if (this.player.x + this.player.size > platform.x && 
                this.player.x < platform.x + platform.dx &&
                this.player.y < platform.y + platform.dy &&
                this.player.y + this.player.size > platform.y + platform.dy)
            this.player.bounceVert(platform);

            else if (this.player.y + this.player.size > platform.y &&
                this.player.y < platform.y + platform.dy &&
                this.player.x - this.player.speed < platform.x + platform.dx &&
                this.player.x + this.player.size + this.player.speed  > platform.x + platform.dx)
            this.player.bounceRight(platform);
            

            else if (this.player.y + this.player.size > platform.y &&
                this.player.y < platform.y + platform.dy &&
                this.player.x + this.player.size + this.player.speed > platform.x &&
                this.player.x - this.player.speed < platform.x)
            this.player.bounceLeft(platform);


        }
    }

    this.move = function(){
        this.player.move();
        this.detectCollisions();
    }

    this.drawBackground = function(){
        for (var i = 0; i < this.platforms.length; i++){ 
            var platform = this.platforms[i];
            platform.draw();
        }
    }

    this.drawPlaforms = function(){
        ctx.fillStyle = 'black';
        ctx.fillRect(0, BOTTOM, WIDTH, MARGIN);
    }

    this.draw = function(){
        this.drawBackground();
        this.drawPlaforms();
        this.player.draw();
    }

    this.update = function(){
        this.move();
        this.draw();
    }
}

function getNextFrame(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    GAME.update();
    window.requestAnimFrame(getNextFrame);
}

window.requestAnimFrame(getNextFrame);
