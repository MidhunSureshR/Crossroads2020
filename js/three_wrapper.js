"use strict";

let renderObject;
let scene;
let camera;
let geometry;
let material;



/** 
 * Sets the canvas element on which THREE js renders.
 * @param {string} canvasId - Id of canvas element as string
 */
function setCanvas(canvasId){
    const canvasElement = document.getElementById(canvasId);
    renderObject = new THREE.WebGLRenderer({ canvas:canvasElement });
}



/**
 * This is where the code first starts executing from.
 */
function entryPoint(){
    /*
    Baisc initializations
    */
    setCanvas("my-canvas");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderObject.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderObject.domElement);
    geometry = new THREE.SphereGeometry(0.25);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    camera.position.z = 5;
   
}


/**
 * Spawns a set of particles randomly.
 * @param {number} populationSize The number of particles to generate.
 * @param {number} radius The radius of the spheres. 
 * @param {Material} material The material used to create the sphere
 * @returns {Array} Containing the particles
 */
function generateParticles(populationSize,radius,material){
    let geometry = new THREE.SphereGeometry(radius);
    let particleArray = [];
    for(let i = 0; i<populationSize; ++i){
        particleArray[i] = new THREE.Mesh(geometry,material);
        particleArray[i].position.x =  Math.random() * 10 - 5;
        particleArray[i].position.y  =  Math.random() * 10 - 5;
        particleArray[i].position.z =  Math.random() * 10 - 5;
        scene.add(particleArray[i]);
    }
    return particleArray;
} 


/**
 * Return a random number between 0 and endRange argument provided.
 * @param {number} endRange The max value of the random number generated
 */
function getRandomNumber(endRange){
    const randomNumber = Math.random();
    return Math.round(randomNumber * endRange);
}


/**
 * Special case for fine numbers
 * Return a random number between 0 and endRange argument provided.
 * @param {number} endRange The max value of the random number generated
 */
function getFineRandomNumber(endRange){
    const randomNumber = Math.random() * endRange;
    return randomNumber;
}


/**
 * Returns rgb string representing some random color.
 */
function getRandomColorString(){
  
    return "rgb(" + getRandomNumber(255) + "," + getRandomNumber(255) + "," + getRandomNumber(255) + ")";
}


/**
 * Function to deal with animations.
 * @param {number} now 
 */
function animate(now) {
    if (!last || now - last >= 0.5 * 1000) {
        last = now;
        material.color = new THREE.Color(getRandomColorString());
    }
    requestAnimationFrame(animate);

    for(let i=0;i<10000;i++){
        particles[i].rotation.x += 0.01;
        particles[i].rotation.y += 0.01;
    }

    camera.position.z += 0.01;
    renderObject.render(scene, camera);
}


/* 
*   Running code
*/
entryPoint();
let particles = generateParticles(10000, 0.01, material);
let last = 0; 
animate(0);
