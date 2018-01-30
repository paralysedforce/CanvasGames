// Canvas and DOM stuff
var canvas = document.getElementById("screen"); 
var ctx = canvas.getContext('2d');
var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;
canvas.width = WIDTH;
canvas.height = HEIGHT;

var MARGIN = 20               // Bottom margin
var BOTTOM = HEIGHT - MARGIN; // y-coordinate of the player
var SPACING = 75;

window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        window.setTimeout(callback, 1000 / 60));
    }();

window.addEventListener('resize', function(e){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    SPACING = WIDTH / 20;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
});

// Keybindings
var LEFTARROW = 37;
var RIGHTARROW = 39;
var DOWNARROW = 40;
var SPACEBAR = 32;

// Input
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case LEFTARROW:
            GAME.player.moveLeft();
            break;
        case RIGHTARROW:
            GAME.player.moveRight();
            break;
        case DOWNARROW:
            GAME.player.stop();
            break;
        case SPACEBAR:
            GAME.player.shoot();
            break;
    }
};

// Global Game state
var GAME = new Game();

// Objects
function Player(){
    this.x = WIDTH / 2;
    this.y = BOTTOM - MARGIN;
    this.img = new Image();
    this.img.src = "assets/SpaceShip.png";
    this.vel = 0;
    this.accel = 10;

    var maxVel = WIDTH/100;
    var dampening = .95;

    this.draw = function(){
        ctx.drawImage(this.img, this.x - this.img.width, this.y - this.img.height);
    };

    this.moveRight = function(){
        if (this.vel < maxVel)
            this.vel += this.accel;
    };

    this.moveLeft = function(){
        if (this.vel > -maxVel)
            this.vel -= this.accel;
    };

    this.stop = function(){
        this.vel = 0;
    };

    this.move = function(){
        this.x += this.vel;
        this.vel *= dampening;
    };
    this.shoot = function(){
        var spawnX = this.x - this.img.width / 2 - 4; // Halfway through ship
        var spawnY = this.y - (this.img.height / 2); //underneath the ship
        GAME.bullets.push(new Bullet(spawnX, spawnY, 'up'));
    };

    this.slowdown = function(){
        this.vel *= dampening;
    }
    this.within = function(bullet){
        return this.x - this.img.width < bullet.x && bullet.x < this.x &&
               this.y - this.img.height < bullet.y && bullet.y < this.y  &&
               bullet.direction == 'down';
    };

}

function Bullet(spawnX, spawnY, direction){
    this.x = spawnX;
    this.y = spawnY; 
    this.length = 10;
    this.dy = 10;
    this.direction = direction;

    this.move = function(){
        if      (this.direction == 'up')   this.y -= this.dy;
        else if (this.direction == 'down') this.y += this.dy;
    };

    this.draw = function(){
        ctx.fillRect(this.x, this.y - 10, this.length, this.length);
    };

    this.isOffscreen = function(){
        return this.y < 0 || this.y > BOTTOM;
    }
}

function Enemy(spawnX, spawnY, direction){
    this.x = spawnX;
    this.y = spawnY;
    this.vel = 3;
    this.verticalDistanceLeft = 0;
    this.direction = direction;

    this.img = new Image();
    this.img.src = "assets/alien.png";

    this.draw = function(){
        ctx.drawImage(this.img, this.x, this.y);
    };

    this.move = function(){
        if (this.direction == "right"){
            this.x += this.vel;
            if (this.x >= WIDTH - MARGIN){
                this.direction = "down";
                this.verticalDistanceLeft = SPACING;
            }
        }
        else if (this.direction == "left"){
            this.x -= this.vel;
            if (this.x <= MARGIN){
                this.direction = "down";
                this.verticalDistanceLeft = SPACING;
            }
        }
        else if (this.direction == "down"){
            this.y += this.vel;
            this.verticalDistanceLeft -= this.vel;
            if (this.verticalDistanceLeft <= 0){
                if (this.x >= WIDTH - MARGIN){
                    // Enemy is on right side of screen
                    this.direction = "left";
                    this.x -= this.vel;
                }
                else {
                    this.direction = "right";
                    this.x += this.vel;
                }
            }
        }

        // Randomly shoot at the player
        if (Math.random() < .003)
            this.shoot();
    };

    this.shoot = function(){
        var spawnX = this.x + this.img.width / 2;
        var spawnY = this.y + this.img.height;
        var bullet = new Bullet(spawnX, spawnY, "down");
        GAME.bullets.push(bullet);
    };

    this.within = function(bullet){
        return this.x < bullet.x && bullet.x < this.x + this.img.width &&
               this.y < bullet.y && bullet.y < this.y + this.img.height &&
               bullet.direction == "up";
    };
}

/* The big damn game container */
function Game(){
    this.player = new Player();
    this.enemies = spawnEnemies();
    this.bullets = [];
    this.stars = generateBackgroundStars();

    this.move = function(){
        this.player.move();

        for (var i = 0; i < this.bullets.length; i++){
            this.bullets[i].move();
            // remove offscreen bullets
            if (this.bullets[i].isOffscreen()){
                this.bullets.splice(i, 1);
                i--; 
            }
        }

        for (var i = 0; i < this.enemies.length; i++){
            this.enemies[i].move();
            if (this.enemies[i].y > this.player.y){
                this.gameOver("lose");
            }
        }
    };

    this.draw = function(){
        this.drawBackground();

        for (var i = 0; i < this.bullets.length; i++)
            this.bullets[i].draw();

        for (var i = 0; i < this.enemies.length; i++)
            this.enemies[i].draw();

        this.player.draw();

    }


    function spawnEnemies(){
        var enemies = [];
        for (var row = MARGIN; row < MARGIN + 3 * SPACING; row += SPACING){
            for (var col = MARGIN; col < WIDTH - MARGIN; col += SPACING){
                var direction = row % 2 == 0 ? "left": "right";
                enemies.push(new Enemy(col, row, direction))
            }
        }
        //enemies.push(new Enemy(WIDTH/2, MARGIN, "right"));
        return enemies;
    };

    this.checkCollisions = function(){
        /* Naive n^2 algorithm for collision detection. I'm sure there's a
         * better way */

        for (var i = 0; i < this.enemies.length; i++){
            var enemy = this.enemies[i];
            for (var j = 0; j < this.bullets.length; j++){
                var bullet = this.bullets[j];
                if (enemy.within(bullet)){
                    this.enemies.splice(i, 1);
                    this.bullets.splice(j, 1);
                    i--;
                    j--;
                    if (this.enemies.length === 0)
                        this.gameOver("win");
                    break;
                }

                if (this.player.within(bullet)){
                    this.gameOver("lose");
                }
            }
        }
    };

    function generateBackgroundStars(){
        var numStars = 200;
        var stars = [];
        for (var i = 0; i < numStars; i++){
            var star = {
                x: Math.random() * WIDTH, 
                y: Math.random() * HEIGHT 
            };
            stars.push(star);
        }
        return stars;
    }

    this.drawBackground = function(){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "white";
        for (var i = 0; i < this.stars.length; i++){
            var star = this.stars[i];
            ctx.fillRect(star.x, star.y, 2, 2); 
        }
    }

    this.gameOver = function(lose){
        var message = lose == 'lose' ? "You lose! Retry?" : "You win! Retry?";
        var newGame = confirm(message);
        if (newGame){
            this.player = new Player();
            this.enemies = spawnEnemies();
            this.bullets = [];
            return;
        }

        else {
            this.enemies = [];
            this.bullets = [];
            return;
        }
    }

    this.update = function(){
        this.move();
        this.checkCollisions();
        this.draw();
    }
}

function getNextFrame(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    GAME.update();
    window.requestAnimFrame(getNextFrame);
}

window.requestAnimFrame(getNextFrame);
