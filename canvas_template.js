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

/*
//mouse support
var mouse = {
    x : WIDTH/2,
    y : HEIGHT/2
};
*/

/*
//arrow keys
var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
*/

