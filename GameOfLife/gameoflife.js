var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
canvas.height = HEIGHT;
canvas.width = WIDTH;

window.addEventListener('resize', function(){
    HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
});

document.onkeydown = function(e){
    if (e.keyCode == 32) GRID = new Grid();
};

window.requestAnimFrame = function(callback){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        window.setTimeout(callback, 1000 / 60));
    }();

var SPACE_LENGTH = 15;
var GRID_WIDTH = Math.floor(WIDTH / SPACE_LENGTH);
var GRID_HEIGHT = Math.floor(HEIGHT / SPACE_LENGTH);

var GRID = new Grid();


function Grid(){
    this.spaces = _initialize_spaces();

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
    
    this.update = function(){
        var newSpaces = _initialize_spaces();

        for (var i = 0; i < GRID_WIDTH; i++){
            for (var j = 0; j < GRID_HEIGHT; j++){
                newSpaces[i][j].alive = this.spaces[i][j].getNewState();
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

    this.getNewState = function(){
        var neigbors = GRID.findNeighbors(this);
        if (this.alive) 
            return neigbors == 2 || neigbors == 3;
        else
            return neigbors == 3
    }

    this.draw = function(){
        if (this.alive) ctx.fillRect(x * SPACE_LENGTH, y * SPACE_LENGTH, SPACE_LENGTH, SPACE_LENGTH);
    }
}

function getNextFrame(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    GRID.update();
    GRID.draw();
    window.requestAnimFrame(getNextFrame);
}


window.requestAnimFrame(getNextFrame);
