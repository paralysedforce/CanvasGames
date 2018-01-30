var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
var LEFT = 5, RIGHT = WIDTH - 5; //for paddle positions

canvas.height = HEIGHT;
canvas.width = WIDTH;
ctx.font = "48px serif";
window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        window.setTimeout(callback, 1000 / 60));
    }();


//mouse support
var mouse = {
    x : WIDTH/2,
    y : HEIGHT/2
};


var PLAYER, OPPONENT, BALL, GAME;

window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', function(){
    HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    ctx.font = "48px serif";
    LEFT = 5, RIGHT = WIDTH - 5; 
    PLAYER.x = LEFT;
    OPPONENT.x = RIGHT;
});


//////////////////////////////////
//                              //
//        Objects               //
//                              //
//////////////////////////////////

function Paddle(isPlayer){
    // Instance variables  //
    this.isPlayer = isPlayer;
    this.width = isPlayer ? 10 : -10;;
    this.length = HEIGHT / 5; 
    this.x = this.isPlayer ? LEFT : RIGHT;
    this.y = HEIGHT / 2;
   
    // Methods //
    this.draw = function(){
        ctx.fillRect(this.x, this.y, this.width, this.length);
    }

    this.move = function(){
        if (this.isPlayer) { 
            // Let the mouse control movement
            
            // The midpoint of the paddle needs to be under the mouse, so we 
            // correct for this by shifting the paddle up by half of its 
            // length. 
        
            this.y = mouse.y - (this.length / 2);
        }

        else {
            // This is AI controlled: make it always move towards the ball.
            var center = this.length / 2;
            if (BALL.y > this.y + center)
                this.y += 8;
            else if (BALL.y < this.y + center)
                this.y -= 8;
        }
    }
}

function Ball(){
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.size = 10; 
    
    this.vx = (Math.random() * 3) + 6;
    this.vy = (Math.random() * 5);

    this.move = function(){
        this.y += this.vy; 
        this.x += this.vx;
    }

    this.draw = function(){
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function Game(player, opponent, ball){
    this.player = player; 
    this.opponent = opponent;
    this.ball = ball;
    
    this.playerScore = 0;
    this.opponentScore = 0;

    this.checkCollisions = function(){
        // Genenerate aliases
        var player = this.player;
        var opponent = this.opponent;
        var ball = this.ball;

        isBallHittingPlayer = 
            ball.x <= LEFT &&
            ball.y >= player.y &&
            ball.y <= player.y + player.length;
        isBallHittingOpponent = 
            ball.x + ball.size >= RIGHT &&
            ball.y >= opponent.y &&
            ball.y <= opponent.y + opponent.length;

        if (isBallHittingPlayer || isBallHittingOpponent) {
            ball.vx *= -1; // Reverse the horizontal direction of the ball
            var contactPaddle = isBallHittingPlayer ? player : opponent;
            // Distance between center of paddle and location of ball
            var dy = (ball.y + ball.size/2) - 
                (contactPaddle.y + contactPaddle.length/2) ;
            console.log(dy);
            ball.vy += dy * .1;
        } 

        if (ball.y <= 0 || ball.y + ball.size >= HEIGHT)
            ball.vy *= -1;

        return isBallHittingOpponent || isBallHittingPlayer;
    }

    this.checkScores = function(){
        if (this.ball.x < 0){
            this.opponentScore += 1;
            this.ball = new Ball();
            ball.vx = Math.floor(ball.vx, -ball.vx);
        }

        else if (this.ball.x > WIDTH){
            this.playerScore += 1;
            this.ball = new Ball();
            ball.vx = Math.ceil(ball.vx, -ball.vx);
        }
        if (this.playerScore === 10){
            alert("Player Won!");
            this.ball = new Ball();
            this.opponentScore = this.playerScore = 0;
        }
        else if (this.opponentScore === 10){
            alert("Computer Won!");
            this.ball = new Ball();
            this.opponentScore = this.playerScore = 0;
        }
        BALL = this.ball;
    }
    this.drawScores = function(){
        var playerTextX = WIDTH * 2 / 5;
        var opponentTextX = WIDTH * 3 / 5;
        var textY = HEIGHT / 10;
        ctx.fillText(this.playerScore.toString(), playerTextX, textY);
        ctx.fillText(this.opponentScore.toString(), opponentTextX, textY);
    }

    this.drawAll = function(){ 
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        this.player.draw();
        this.opponent.draw();
        this.ball.draw();
        this.drawScores()
    }

    this.moveAll = function(){
        this.player.move();
        this.opponent.move();
        this.ball.move();
    }
}

PLAYER = new Paddle(true);
OPPONENT  = new Paddle(false);
BALL = new Ball(Math.random() <= .5 ? 'left' : 'right');
GAME = new Game(PLAYER, OPPONENT, BALL);

function getNextFrame(){
    GAME.moveAll();
    GAME.drawAll();
    if (!GAME.checkCollisions()){
        GAME.checkScores();
    }
    window.requestAnimFrame(getNextFrame);
}


window.requestAnimFrame(getNextFrame);

//TODO: Implement wall bounces
//      Improve AI
//      Implement scoring
