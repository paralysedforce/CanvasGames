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

// Physical constants
const dt = 1 / 60;
const g = 1;
const LFactor = 30;

function Pendulum(L, theta, R){
    const massFactor = 1;

    // Length
    this.L = L / LFactor;

    // Radius
    this.R = R;
    this.M = massFactor * R * R; // Mass is proportional to the area of the weight

    // Angle against the y-axis
    this.theta = theta;

    // Momentum
    this.p = 0;
}

const squared = (x) => x * x;
const {sin, cos} = Math;
const sum = (arr) => arr.reduce((acc, cur) => acc + cur);

var PENDULUMS = [new Pendulum(100, Math.PI / 3, 5), new Pendulum(30, Math.PI / 8, 3) ];
var TOTAL_ENERGY = [0, 0];

function step(pendulums){
    [pend1, pend2] = pendulums;

    /* Some helpful constants */
    
    // Difference in angles between the pendula
    const dTheta = pend1.theta - pend2.theta;
    // Total mass 
    const M = pend1.M + pend2.M;

    /* 
     * The canonical momentum  p_i =dL/dqDot_i can be rewritten as a matrix equation
     * We can invert this matrix to acquire expressions for the angular velocities
     */
    const det = (
        (M * squared(pend1.L) * pend2.M * pend2.L) - 
        (squared(pend1.L * pend2.L * pend2.M * cos(dTheta)))
    );

    const theta1Dot = (
        ((pend2.M * pend2.L)                          * pend1.p) + 
        ((-pend1.L * pend2.L * cos(dTheta) * pend2.M) * pend2.p)
    ) / det;

    const theta2Dot = (
        ((-pend2.M * pend1.L * pend2.L * cos(dTheta)) * pend1.p) +
        ((M * squared(pend1.L))                       * pend2.p)
    ) / det;

    /* 
     * The change in momentum qDot_i=dL/dq_i, which comes immediately from 
     * the Euler-Langrange equations
     */
    const p1Dot = (
        - pend2.M * pend1.L * pend2.L * theta1Dot * theta2Dot * sin(dTheta) -
        M * g * pend1.L * sin(pend1.theta)
    );

    const p2Dot = (
        pend2.M * pend1.L * pend2.L * theta1Dot * theta2Dot * sin(dTheta) -
        pend2.M * g * pend2.L * sin(pend2.theta)
    );

    return [theta1Dot, theta2Dot, p1Dot, p2Dot];
}

function energy(pendulums, step){
    [pend1, pend2] = pendulums;
    [theta1Dot, theta2Dot, p1Dot, p2Dot] = step;

    const dTheta = pend1.theta - pend2.theta;

    const kinetic = (
        (pend1.M / 2) * squared(pend1.L * theta1Dot) +  
        (pend2.M / 2) * (
            squared(pend1.L * theta1Dot) + 
            squared(pend2.L * theta2Dot) +
            2 * pend1.L * pend2.L * theta1Dot * theta2Dot * cos(dTheta)
        )
    );

    const potential = (
        (
            pend1.M * g * pend1.L * cos(pend1.theta)
        ) + (
            pend2.M * g * (
                pend1.L * cos(pend1.theta) + 
                pend2.L * cos(pend2.theta)
            )
        )
    );

    TOTAL_ENERGY = [kinetic, potential]
}

function updatePendulums(pendulums, update, dt){
    [pend1, pend2] = Array.from(pendulums);
    [theta1Dot, theta2Dot, p1Dot, p2Dot] = update;

    pend1.theta += theta1Dot * dt;
    pend2.theta += theta2Dot * dt;

    pend1.p +=  p1Dot * dt;
    pend2.p +=  p2Dot * dt;

    return [pend1, pend2];
}

function eulerStep(){
    const step1 = step(PENDULUMS);
    PENDULUMS = updatePendulums(PENDULUMS, step1, dt);
    energy(PENDULUMS, step1);
}

function rk4Step(){
    const step1 = step(PENDULUMS);

    const step2Pendulums = updatePendulums(PENDULUMS, step1, dt/2);
    const step2 = step(step2Pendulums);

    const step3Pendulums = updatePendulums(PENDULUMS, step2, dt/2);
    const step3 = step(step3Pendulums);

    const step4Pendulums = updatePendulums(PENDULUMS, step3, dt);
    const step4 = step(step4Pendulums);

    const combinedStep = [];
    for (let i = 0; i < step1.length; i++){
        combinedStep.push((step1[i] + 2 * step2[i] + 2 * step3[i] + step4[i]) / 6);
    }

    PENDULUMS = updatePendulums(PENDULUMS, combinedStep, dt);
    energy(PENDULUMS, combinedStep);
}




function draw(){ 
    // Pin the first pendulum to the center of the screen
    let lastPos = {x: WIDTH / 2, y: HEIGHT / 2};
    let textY = 40;

    for (let pendulum of PENDULUMS){
        const x = lastPos.x + pendulum.L * LFactor * Math.sin(pendulum.theta);
        const y = lastPos.y + pendulum.L * LFactor * Math.cos(pendulum.theta);

        // Draw the rod
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        // Draw the weight
        ctx.beginPath();
        ctx.arc(x, y, pendulum.R, 0, 2 * Math.PI)
        ctx.fill();
        ctx.closePath();

        let textX = 40; 
        ctx.fillText(`x: ${x}`, 40, textY);
        ctx.fillText(`y: ${y}`, 160, textY);
        ctx.fillText(`p: ${pendulum.p}`, 280, textY);
        textY += 10;

        // Pin the next pendulum to the current position
        lastPos = {x: x, y: y}
    }


    const totalP = sum(PENDULUMS.map(pend => pend.p));
        

    ctx.fillText(`${totalP}`, 280, textY);
    textY += 10;
    ctx.fillText(`${TOTAL_ENERGY[0]}`, 280, textY);
    textY += 10;
    ctx.fillText(`${TOTAL_ENERGY[1]}`, 280, textY);
    textY += 10;
    ctx.fillText(`${sum(TOTAL_ENERGY)}`, 280, textY);
}

function update() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    rk4Step();
    draw();
    window.requestAnimFrame(update);
}

window.requestAnimFrame(update);
