//DOM stuff and globals
var canvas = document.getElementById("canvas");
var ctx= canvas.getContext('2d');
var WIDTH = window.innerWidth, HEIGHT=window.innerHeight;
canvas.width = WIDTH; canvas.height=HEIGHT;
window.addEventListener('resize',  function(){
    HEIGHT = canvas.height = window.innerHeight;
    WIDTH = canvas.width = window.innerWidth;
});
var FPS = 60.;
var SPEED = 300;

window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        window.setTimeout(callback, 1000 / FPS));
    }();

var mouse = {
	x : WIDTH/2,
	y : HEIGHT/2
};

canvas.addEventListener('mousemove',function(e){
	mouse.x = e.x;
	mouse.y = e.y;
});
//Particle methods

function Particle(){
	this.x = mouse.x;
	this.y = mouse.y;
    this.theta = Math.random() * 2  * Math.PI;
	this.vx = Math.cos(this.theta) * SPEED;
	this.vy = Math.sin(this.theta) * SPEED;
}

Particle.prototype.draw = function draw(){
	ctx.clearRect(this.x,this.y,5,5);
}

Particle.prototype.move=function(){
	var ay = 9;
    if (this.y<HEIGHT)
        this.vy += ay;
    else
        this.vy*=-.3;
    this.x += this.vx/FPS;
	this.y += this.vy/FPS;
}
//Initializing

var particleArray = [new Particle()];

function update(){
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	particleArray.push(new Particle());
	for (var i=0; i<particleArray.length; i++){
        particleArray[i].move();
		particleArray[i].draw();
	}
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
