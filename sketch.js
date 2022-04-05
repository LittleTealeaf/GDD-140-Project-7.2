/// <reference path="./node_modules/@types/p5/global.d.ts" />

class Pixel {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    // interpolate() {
    //     this.current += (this.goal - this.current) * 0.01;
    // // }

    // isFinished() {
    //     return Math.abs(this.current - this.goal) < 0.1;
    // }
}

var imgBefore, imgAfter;

const pixelSize = 10;
var radius;

var buffer = [];
var nextIter = true;

const perFrame = 1000;


function preload() {
    imgBefore = loadImage('assets/before.jpg');
    imgAfter = loadImage('assets/after.jpg');
}

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    rectMode(CENTER);


    radius = int(200 / pixelSize) * pixelSize;

    // resize images
    imgBefore.resize(width, height);
    imgAfter.resize(width, height);

    console.log(imgBefore.get(0, 0));

    noStroke();
    frameRate(60);

    for (var x = pixelSize / 2; x < width; x += pixelSize) {
        for (var y = pixelSize / 2; y < height; y += pixelSize) {
            buffer.push(new Pixel(x, y, 0, 0));
        }
    }
}

async function draw() {
    var count = 0;

    const mx = int((mouseX - pixelSize / 2) / pixelSize) * pixelSize + pixelSize / 2;
    const my = int((mouseY - pixelSize / 2) / pixelSize) * pixelSize + pixelSize / 2;

    for(var x = mx - radius - pixelSize; x <= mx + pixelSize +  radius; x += pixelSize) {
        for(var y = my - radius - pixelSize; y <= my + pixelSize + radius; y+= pixelSize) {
            if(x > 0 && x < width && y > 0 && y < height) {
                updatePixel(x,y,getTransition(x,y));
            }
        }
    }

    console.log("Rendering " + buffer.length + " pixels");
    while(count < perFrame && buffer.length > 0) {
        count++;
        const p = buffer.pop();
        const colors = await Promise.all([getColor(p.x, p.y, imgBefore), getColor(p.x, p.y, imgAfter)]);
        fill(Array.from({length: 4}, (_, k) => colors[1][k] * p.value + colors[0][k] * (1 - p.value)));
        
        rect(p.x, p.y, pixelSize, pixelSize);
    }
}

async function getColor(x, y, img) {
    return img.get(x, y);
}

function getTransition(x, y) {
    const d = dist(x, y, mouseX, mouseY);
    if (d > radius) {
        return 0;
    } else {
        return map(d, 0, radius, 1,0);
    }
}

function updatePixel(x, y, value) {
    for (const pixel of buffer) {
        if (pixel.x == x && pixel.y == y) {
            pixel.current = value;
            return;
        }
    }
    buffer.push(new Pixel(x, y, value));
}