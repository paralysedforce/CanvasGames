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
var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

function Cell(x, y){
    return {x: x, y: y}
};

function getStartingSquares(shape){
    switch (shape){
        case "I": return [Cell(6, 0), Cell(6, 1), Cell(6, 2), Cell(6, 3)];
        case "L": return [Cell(6, 0), Cell(6, 1), Cell(6, 2), Cell(7, 2)];
        case "J": return [Cell(6, 0), Cell(6, 1), Cell(6, 2), Cell(5, 2)];
    }
}

class Square {
    constructor(color, shape){
        this.color = color;
        this.squares = getStartingSquares(shape);
    }
}

class Grid {
    GridWidth = 12;
    GridHeight = 18;
    
    constructor() {
        this.grid = {};
    }

    addBlock(block){
        block.squares.forEach((square) => {
            this.grid[[square.x, square.y]] = square.color;
        });
    }

    getGridID(x, y)
}


function update() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
