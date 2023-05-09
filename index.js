import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu';

// import * as mpPose from '@mediapipe/pose';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs-core';

tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
        tfjsWasm.version_wasm}/dist/`);

import * as posedetection from '@tensorflow-models/pose-detection';

import { VideoSetup, Camera } from '../avLib/videoSetup'
import { AudioSetup, Analyser } from '../avLib/audioSetup'
import * as THREE from 'three';
import {Camera} from './camera';

let detector; 

let a = new AudioSetup; 
let th = new VideoSetup;
let camera;
let sph; 
const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );

async function init(){
    
    a.initAudio();
    // cam.init; 
    const elCanvas = document.getElementById( 'myCanvas');
    elCanvas.style.display = 'none';     
    document.body.style.cursor = 'none'; 
    const overlay = document.getElementById( 'overlay' );
    overlay.remove();
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    instructions.remove(); 
    blocker.remove();
    
    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    // a.initAudio(); 

    console.log(a.audioCtx); 
    an = new Analyser(a.audioCtx);

    console.log(an.microphone); 
    
    th.initVideo();
    th.hydraInit();
    an.initAnalyser(512, 0.8); 

    console.log(an); 
    container.appendChild(th.renderer.domElement);
    const geometry = new THREE.SphereGeometry( 5, 6, 16 ); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } ); 
    sph = new THREE.Mesh( geometry, material );
    th.scene.add( sph );
    detectar();
   
}

function animate(){
    requestAnimationFrame ( animate)
    render(); 
}

function render(){
    th.renderer.render(th.scene, th.camera);
    renderPrediction();
    if( poses.length > 0 ){
	sph.position.y = (poses[0].keypoints[0].y / 10) * -1
	sph.position.x = (poses[0].keypoints[0].x / 10) 
	// sph.position.z = (poses[0].keypoints[0].z / 10)*-1
	// console.log(poses[0].keypoints[0].y); 
    }
}

async function detectar(){
    //camera = await new Camera;
    camera = await Camera.setup({targetFPS: 60, sizeOption: '640 X 480'});
    
    detector =  await posedetection.createDetector(posedetection.SupportedModels.PoseNet, {
        quantBytes: 4,
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: {width: 500, height: 500},
        multiplier: 0.75
    });

    posedetection.movenet.modelType.MULTIPOSE_LIGHTNING;

 
    animate()
    console.log(detector); 
    
}

async function renderPrediction(){
    // await renderResult();
    
    poses = await detector.estimatePoses(
        camera.video,
        {maxPoses: 4, flipHorizontal: true});

    // cons
    if(poses.length > 0){
    	// console.log(poses[0]);
    }
    
}

