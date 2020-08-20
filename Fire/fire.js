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

//mouse support
var mouse = {
    x : WIDTH/2,
    y : HEIGHT/2
};

canvas.addEventListener('mousemove',(e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

canvas.addEventListener('click', (e) => {
    initialize();
});
function rgb(r,g,b) {
        ctx.fillStyle = "rgb("+
            r +"," + 
            g + ',' + 
            b + ')';
}

function Particle(x, y){
    this.x = x;
    this.y = y;
    this.velX = 2 *Math.random() - 1;
    this.velY = 2 * Math.random() - 1;
    this.color = [
       Math.floor( Math.random() * 255),
       Math.floor( Math.random() * 255),
       Math.floor( Math.random() * 255)];
    this.radius = 5;

    this.move = function(){
        this.velX += .2 * Math.random() - .1;
        this.velY += .2 * Math.random() - .1;
        this.x = ((this.x + this.velX) + WIDTH)  % WIDTH;
        this.y = ((this.y + this.velY) + HEIGHT) % HEIGHT;
    }

    this.update = function() {
        this.color[0] += 2 * Math.random() - 1;
        this.color[1] += 2 * Math.random() - 1;
        this.color[2] += 2 * Math.random() - 1;

        this.radius  *= .999;
        rgb(this.color[0],this.color[1],this.color[2]);

    }

    this.draw = function() {
        ctx.fillRect(this.x, this.y, this.radius, this.radius);
    }
}

var particles = [];
function initialize(){
    for (var i = 0; i < 200; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }
}

function update() {
    var newParticles = [];
    for (const particle of particles){
        if (particle.radius < 1) {
            continue;
        }

        particle.update();
        particle.move();
        particle.draw();
        newParticles.push(particle);
    }

    particles = newParticles;

    window.requestAnimFrame(update);
}

initialize();
window.requestAnimFrame(update);
