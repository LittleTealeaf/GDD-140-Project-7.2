/// <reference path="./node_modules/@types/p5/global.d.ts" />

/*
Optimization ideas:
 - Only re-render the area around the mouse
*/


function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
}

function draw() {
    background(0);
}