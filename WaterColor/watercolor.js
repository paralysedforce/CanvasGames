var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
canvas.height = HEIGHT;
canvas.width = WIDTH;

var mouse = {};

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

window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener("mousedown", function(e){
    mouse.down = true;
});

window.addEventListener("mouseup", function(e){
    mouse.down = false;
});

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 67){ // C => Clear
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
});

function gaussianRand(){
    const numSamples = 4;
    let sum = 0;

    for (let i = 0; i < numSamples; i++){
        sum += Math.random();
    }
    return sum / numSamples;
}

const makeBasePolygon = function(center) {
    const vertices = [];
    const numSides = 5;
    const radius = 10;
    for (let a = 0; a < 2 * Math.PI; a += 2 * Math.PI / numSides){
        const vertex = new Vector(Math.cos(a), Math.sin(a))
            .scale(radius)
            .add(center);
        vertices.push(vertex);
    }
    return new Polygon(vertices);
};

const perturbPolygon = function(polygon){
    const perturbedVertices = [];

    for (let i = 0; i < polygon.vertices.length; i++){
        const start = polygon.vertices[i];
        const end = polygon.vertices[(i + 1) % polygon.vertices.length];
        const mid = start.displacement(end).scale(.5);
        const distLength = polygon.vertices.length;
        const displaced = new Vector(
                mid.x + distLength * (gaussianRand() - .5),
                mid.y + distLength * (gaussianRand() - .5))
            .add(start);
        perturbedVertices.push(start, displaced);
    }

    return new Polygon(perturbedVertices);
}

const drawPolygon = function(polygon) {
    ctx.beginPath();
    for (const vertex of polygon.vertices){
        ctx.lineTo(vertex.x, vertex.y);
    }
    ctx.closePath();
    ctx.fill()
}

function makeBrush(basePolygon){
    let perturbed = basePolygon;
    for (let i = 0; i < 3; i++){
        perturbed = perturbPolygon(perturbed);
    }

    for (let i = 0; i < 5; i++){
        let perturbedVariant = perturbed;
        for (let j = 0; j < 2; j++){
            perturbedVariant = perturbPolygon(perturbedVariant);
        }
        drawPolygon(perturbedVariant);
    }
}

function brushes(center){
    let basePolygon = makeBasePolygon(center);
    ctx.fillStyle = 'rgba(200, 40, 40, .04)';
    makeBrush(basePolygon);

    basePolygon = makeBasePolygon(center);
    ctx.fillStyle = 'rgba(40, 100, 150, .025)';
    makeBrush(basePolygon);
}

function update(){
    if (mouse.down){
        brushes(new Vector(mouse.x, mouse.y));
    }
    requestAnimFrame(update)
}
update();


