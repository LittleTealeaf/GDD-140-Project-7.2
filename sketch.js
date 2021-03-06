/// <reference path="./node_modules/@types/p5/global.d.ts" />

class Pixel {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}


var imgBefore, imgAfter;

//Setting radius of pixels
const pixelSize = 4;
var radius = Math.round(200 / pixelSize);

//Buffer of 'pixels needed to be rendered'
const buffer = [];
//Number of renders per frame
const perFrame = 10000;
//Initial counter of pixels before it pushes pixels around the mouse to the buffer
var initialCount = 0;

function preload() {
    imgBefore = loadImage('assets/before.jpg');
    imgAfter = loadImage('assets/after.jpg');
}

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);

    //resize to canvas
    imgBefore.resize(width, height);
    imgAfter.resize(width, height);


    frameRate(30);
    
    
    

    //Initial populating buffer
    for(var x = 0; x < int(width / pixelSize) + 1; x++) {
        for(var y = 0; y < int(height / pixelSize) + 1; y++) {
            buffer.unshift(new Pixel(x,y));
            initialCount++;
        }
    }
}

function draw() {
    //Local count of number of renders this frame
    var count = 0;
    noStroke();

    while(count < perFrame && buffer.length > 0) {
        //Increment count
        count++;
        //Take from buffer
        const p = buffer.shift();

        //Get the transition color
        const val = getTransition(p.x,p.y);

        // render pixel
        const colors = [imgBefore.get(p.x * pixelSize,p.y * pixelSize),imgAfter.get(p.x * pixelSize,p.y * pixelSize)];
        fill(Array.from({length: 4}, (_, k) => colors[1][k] * val + colors[0][k] * (1 - val)));
        rect(p.x * pixelSize, p.y * pixelSize, pixelSize, pixelSize);

        //If the value wasn't 0
        if(val != 0) {
            buffer.push(p);
        }

        //Decrement if initial count was more
        if(initialCount > 0) {
            initialCount--;
        }

    }

    
    if(initialCount == 0) {
        const mx = int(mouseX / pixelSize);
        const my = int(mouseY / pixelSize);

        for(var x = mx - radius; x <= mx + radius; x++) {
            for(var y = my - radius; y <= my + radius; y++) {
                pushPixel(x,y);
            }
        }
    }
}

function pushPixel(x,y) {
    for(const p of buffer) {
        if(p.x == x && p.y == y) {
            return;
        }
    }
    buffer.push(new Pixel(x,y));
}

function getTransition(x, y) {
    const d = dist(x, y, mouseX / pixelSize, mouseY / pixelSize);
    if (d > radius) {
        return 0;
    } else {
        return map(d, 0, radius, 1,0);
    }
}
