/* Web setup */
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
canvas.height = HEIGHT; canvas.width = WIDTH;

window.addEventListener('resize', function(){
    HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
});

/* Input methods */
var mouse = {x : WIDTH/2, y : HEIGHT / 2, down: false};

canvas.addEventListener('mousedown',  function(e){
    mouse.down = true;
});

canvas.addEventListener('mouseup', function(e){
    mouse.down = false;
});

canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
});

document.onkeydown = function(e){
    if (e.keyCode == 82) GRID = new Grid(); // Pressing 'R' randomizes the grid
    if (e.keyCode == 67) GRID.clear(); // Pressing 'C' clears the grid
    if (e.keyCode == 70) {
        if (!GRID.frozen) GRID.freeze();
        else GRID.unfreeze();
    }
};

/* Animation */
const FPS = 10;
window.requestAnimFrame = function(callback){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        window.setTimeout(callback, 1000 / 60));
    }();

/* Grid constants */
const SPACE_LENGTH = 15;
const GRID_WIDTH = Math.floor(WIDTH / SPACE_LENGTH);
const GRID_HEIGHT = Math.floor(HEIGHT / SPACE_LENGTH);
var GRID = new Grid();


function Grid(){
    this.spaces = _initialize_spaces();
    this.frozen = false;

    // Computes the number of living neighbers surrouding a space
    this.findNeighbors = function(space){
        var x = space.x + GRID_WIDTH;
        var y = space.y + GRID_HEIGHT;
        var count = 0;

        for (var i = x - 1; i <= x + 1; i++){
            for (var j = y - 1; j <= y + 1; j++){
                var indx = i % GRID_WIDTH;
                var indy = j % GRID_HEIGHT;
                if (this.spaces[indx][indy].alive)
                    count++;
            }
        }

        if (this.spaces[space.x][space.y].alive) count--;
        return count;
    }

    this.clear = function(){
        for (var i = 0; i < GRID_WIDTH; i++){
            for (var j = 0; j < GRID_HEIGHT; j++){
                this.spaces[i][j].alive = false;
            }
        }
    }
    this.freeze = function(){
        for (var i = 0; i < GRID_WIDTH; i++){
            for (var j = 0; j < GRID_HEIGHT; j++){
                this.spaces[i][j].frozen = true;
            }
        }
        this.frozen = true;
    }

    this.unfreeze = function(){
        for (var i = 0; i < GRID_WIDTH; i++){
            for (var j = 0; j < GRID_HEIGHT; j++){
                this.spaces[i][j].frozen = false;
            }
        }
        this.frozen = false;
    }
   
    
    this.update = function(){
        if (this.frozen) return;
        var newSpaces = _initialize_spaces();

        for (var i = 0; i < GRID_WIDTH; i++){
            for (var j = 0; j < GRID_HEIGHT; j++){
                newSpaces[i][j].alive = this.spaces[i][j].getNewState();
                newSpaces[i][j].frozen = this.spaces[i][j].frozen;
            }
        }
        this.spaces = newSpaces;
    }

    this.draw = function(){
        for (var i = 0; i < GRID_WIDTH; i++){
            for (var j = 0; j < GRID_HEIGHT; j++){
                this.spaces[i][j].draw();
            }
        }
    }

    this.handleMouseInput = function(){
        if (mouse.down){
            var indx = Math.floor(mouse.x * GRID_WIDTH / WIDTH);
            var indy = Math.floor(mouse.y * GRID_HEIGHT / HEIGHT);
            this.spaces[indx][indy].alive = true;
            this.spaces[indx][indy].frozen = true;
        }

        else {
            // Only unfreeze mouse input
            if (!this.frozen)
                this.unfreeze();
        }
    }

    function _initialize_spaces(){
        var colArray = [];
        for (var i = 0; i < GRID_WIDTH; i++){
            var rowArray = [];
            for (var j = 0; j < GRID_HEIGHT; j++){
                rowArray.push(new Space(i, j));
            }
            colArray.push(rowArray)
        }
        return colArray;
    }
}

function Space(x, y){
    this.alive = Math.random() > .5;
    this.x = x;
    this.y = y;
    this.frozen = false;

    this.getNewState = function(){
        if (this.frozen) return this.alive;

        var neigbors = GRID.findNeighbors(this);
        if (this.alive) 
            return neigbors == 2 || neigbors == 3;
        else
            return neigbors == 3
    }

    this.draw = function(){
//        ctx.fillStyle = this.frozen ? '#110272' : 'black';
        if (this.alive) ctx.fillRect(x * SPACE_LENGTH, y * SPACE_LENGTH, SPACE_LENGTH, SPACE_LENGTH);
    }
}

function getNextFrame(){
    // We don't want any framerate constraints on input 
    GRID.handleMouseInput();

    if (Date.now() - last_updated > 1000. / FPS){
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        GRID.update();
        GRID.draw();
        last_updated = Date.now();
    }
    window.requestAnimFrame(getNextFrame);
}


function main(){
    last_updated = Date.now();
    window.requestAnimFrame(getNextFrame);
}
main();
