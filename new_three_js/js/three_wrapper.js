/**
                             *  CROSSROADS 2020 THREE JS WRAPPER
                             *  @author R Midhun Suresh
                             *  @author Kevin Jacob
 */


"use strict";



import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import {ShaderPass} from './jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from './jsm/shaders/FXAAShader.js';
import { GlitchPass } from './jsm/postprocessing/GlitchPass.js';

//THREE JS Environemnt
let renderObject;
let scene;
let camera;
let geometry;
let material;
let model = null;
let lightLogo;

//Colors
let colorBackground = new THREE.Color(0x0d0912);
let colorText = new THREE.Color(0xF5001C);
let colorWhite = new THREE.Color(0xffffff);

//Parallax effect
let x;
let y;
let rotateIndicator = 0;

//Glitch effect
let glitchPass;
let composer;


/**
 * This is where the code first starts executing from.
 */
function entryPoint(){
    /*
    Baisc initializations
    */
    setCanvas("my-canvas");
    
    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog(0x000000, 1, 1000);
    scene.background = colorBackground;
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderObject.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderObject.domElement);

    renderObject.setClearColor(colorWhite);
    geometry = new THREE.SphereGeometry(0.25);

    material = new THREE.MeshBasicMaterial({ color: colorWhite });
   
   
    var light = new THREE.AmbientLight(0x404040,100); // soft white light
    scene.add(light);
    light.position.set(0,50,0);
    
 
    addLogoLight();
    
    loadCrossroadsLogoModel();
   

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light)
    
    var fxaaPass = new ShaderPass(FXAAShader);

    var pixelRatio = renderObject.getPixelRatio();
    var uniforms = fxaaPass.material.uniforms;

    uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
    uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
  
    

    composer = new EffectComposer(renderObject);
    
    var renderPass = new RenderPass(scene, camera);
    var width = window.innerWidth || 1;
    var height = window.innerHeight || 1;
    var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };

    var renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
    
    composer.addPass(renderPass,renderTarget);
    
    glitchPass = new GlitchPass();
    composer.addPass(glitchPass);
    composer.addPass(fxaaPass);
    camera.position.z = 5;
 
}



/** 
 * Sets the canvas element on which THREE js renders.
 * @param {string} canvasId - Id of canvas element as string
 */
function setCanvas(canvasId) {
    const canvasElement = document.getElementById(canvasId);
    renderObject = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
    renderObject.setClearColor(0x000000, 0);
    //renderObject.autoClear = false;
}


/**
 * Loads crossroads logo 3D model (.gld file) 
 */



function loadCrossroadsLogoModel() {
    let loader = new THREE.GLTFLoader();
    loader.load('res/model.gltf', function (gltf) {
        model = gltf.scene;
        alignCRLogoCentered();
        scene.add(model);
        lightLogo.position.x = model.position.x;
        lightLogo.position.y = model.position.y;
        lightLogo.position.z = model.position.z + 20;
        renderObject.render(scene, camera);
    }, undefined, function (error) {
        console.error(error);
    });
}



/**
 * Adds the point light source to illuminate the 3D logo
 */
function addLogoLight() {
    // lightLogo = new THREE.PointLight(colorWhite, 1, 100);
    // lightLogo.position.set(0, 0, 50);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    var light = new THREE.PointLight(0xc4c4c4, 10);
    light.position.set(0, 300, 500);
    scene.add(light);
    var light2 = new THREE.PointLight(0xc4c4c4, 10);
    light2.position.set(500, 100, 0);
    scene.add(light2);
    var light3 = new THREE.PointLight(0xc4c4c4, 10);
    light3.position.set(0, 100, -500);
    scene.add(light3);
    var light4 = new THREE.PointLight(0xc4c4c4, 10);
    light4.position.set(-500, 300, 500);
    scene.add(light4);
    renderObject.render(scene, camera);
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



var elem1 = document.getElementById("pos_indicator");

/**
 * Makes CR LOGO aligned on screen
 */
function alignCRLogoCentered(){
    //camera.rotation.y += 0.01; 
    model.rotation.x = 7.8;
    model.rotation.y = 5.0;
    model.rotation.z = 6.0;
}


/**
 * Function to deal with animations.
 * @param {number} now
 */
const rotateFactorY = 0.0;
const rotateFactorZ = 0.002;
//const initCameraPosition = camera.position;
function animate(now) {
    // if (!last || now - last >= 0.5 * 1000) {
    //     last = now;
    //     material.color = new THREE.Color(getRandomColorString());
    // }
    requestAnimationFrame(animate);
    
    if(rotateIndicator > 0){
        model.rotation.y += rotateFactorY;
        model.rotation.z += rotateFactorZ;
        camera.rotation.y -= rotateFactorZ;
        
    }
    else if(rotateIndicator < 0){
        model.rotation.y -= rotateFactorY;
        model.rotation.z -= rotateFactorZ;
        camera.rotation.y += rotateFactorZ;
    }
    else{
        if(model.rotation.y > 7.8 && model.rotation.y != 7.8){
            //Bring slowly back to normal
            model.rotation.y -= rotateFactorY;
            model.rotation.z -= rotateFactorZ;
        }
        else if(model.rotation.y < 7.8 && model.rotation.y >=0){
            model.rotation.y += rotateFactorY;
            model.rotation.z += rotateFactorZ;
        }
    }
    
    //elem1.innerText = "Position = " + model.rotation.z;
    composer.render();
    //renderObject.render(scene, camera);

}


/* 
*   Running code
*/
entryPoint();

 //Create parallax logo effect
addEventListener("mousemove",handleParallaxLogo);

/**
 * Handles parallax effect for the CR Logo
 * @param {Event} event  mousemove event 
 */
function handleParallaxLogo(event){
    if(x > event.clientX){
        //Cursor moved to right
       // console.log("Positive roation on X axis");
        rotateIndicator = 1;
    }
    else if(x < event.clientX){
        //Cursor moved to left
       // console.log("Negative roation on X axis");
        rotateIndicator = -1;
    }
    else{
        //No change in cursor
        rotateIndicator = 0;
    }
    x = event.clientX;
    y = event.clientY;
   // console.log(x + " --- " + y);
}
 
let last = 0; 
animate(0);



