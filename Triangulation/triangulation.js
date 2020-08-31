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


window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other){
        return new Vector(this.x + other.x, this.y + other.y);
    }

    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    length() {
        return dist(this.x, this.y);
    }

    isZero() {
        return this.x === 0 && this.y === 0;
    }

    direction() {
        return this.scale(1. / this.length());
    }

    displacement(other){
        return new Vector(other.x - this.x, other.y - this.y);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    static Zero() {
        return new Vector(0, 0);
    }
}

function rgba(r,g,b,a) {
        ctx.fillStyle = "rgba("+
            r +"," + 
            g + ',' + 
            b + ',' +
            a + ')';
}

class Triangle {
    constructor(vertices){
        this.vertices = vertices;
        this.vel = Vector.Zero();
        this.color = [
           Math.floor( Math.random() * 255),
           Math.floor( Math.random() * 255),
           Math.floor( Math.random() * 255),
            .3
        ];
    }

    contains(v) {
        const v0 = this.vertices[0];
        const v1 = v0.displacement(this.vertices[1]);
        const v2 = v0.displacement(this.vertices[2]);

        function det(u, v) {
            return u.x * v.y - u.y * v.x;
        }

        const a = (det(v, v2) - det(v0, v2)) / det(v1, v2);
        const b = -(det(v, v1) - det(v0, v1)) / det(v1, v2);

        console.log(a, b);
        return (a > 0 && b > 0) && (a + b) < 1;
    }

    render(){
        rgba(this.color[0], this.color[1], this.color[2], this.color[3]);

        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
        ctx.lineTo(this.vertices[2].x, this.vertices[2].y);
        ctx.closePath();
        ctx.fill();
    }

    move() {
        for (let i = 0; i < this.vertices.length; i++){
            const noise = new Vector(Math.random(), Math.random())
                .add(new Vector(-.5, -.5))
                .scale(1.4);
            this.vel = this.vel.add(noise);

            //this.vertices[i] = this.vertices[i].add(this.vel);
        }
    }
}

//mouse support
var mouse = new Vector(WIDTH / 2, HEIGHT / 2);

function dist(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

var vertices = [];
var triangles = [];
var curTriangle = [];

canvas.addEventListener('mousedown', (e) => {
    const v = mouse.copy();
    vertices.push(v);
    for (let i = 0; i < triangles.length; i++){
        const triangle = triangles[i];

        if (triangle.contains(v)){
            const v0 = triangle.vertices[0];
            const v1 = triangle.vertices[1];
            const v2 = triangle.vertices[2];
            const oldColor = triangle.color;

            triangles.splice(i, 1,  
                new Triangle([v0, v1, v]), 
                new Triangle([v1, v2, v]),
                new Triangle([v0, v2, v]));

            triangles[i].color = oldColor;
            return;
        }
    }
    vertices.sort((first, second) => {
        return v.displacement(first).length() -
            v.displacement(second).length();
    });

    if (vertices.length >= 3){
        const newTriangle  = Array.from(vertices.slice(0, 3));
        triangles.push(new Triangle(Array.from(newTriangle)));
    }

    }
);

function update(){
    
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let triangle of triangles){
        triangle.move();
        triangle.render();
    }

    window.requestAnimFrame(update);
}

window.requestAnimFrame(update);

