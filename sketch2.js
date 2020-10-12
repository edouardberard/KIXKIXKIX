// Credits
// Most of code from "ml5.js: Pose Regression" by The Coding Train / Daniel Shiffman
// Modified to adapt variable font
//
// All styling mostly happens in this file as I couldn't move it over HTML & CSS
// Sorry for all the styling tags
// 
// 

let video;
let poseNet;
let pose;
let skeleton;
let brain;
let fontWeight;
let button;
var timerValue = 5;

function setup() {
  c = createCanvas(200, 150);
  // Canvas settings to fit only the camera feedback
  c.style('padding', '10px');
  c.style('position', 'fixed');
  c.style('bottom', '0');
  c.style('left', '0');
  fontWeight = createSlider(100, 200, 100);
  fontWeight.hide();

  // Variable font feedback
  p = createP('ABCDEFGHIJKLMN<br>OPQRSTUVWXYZ');
  p.style('position', 'absolute');
  p.style('top', '25%');
  p.style('margin-left', 'auto');
  p.style('margin-right', 'auto');
  p.style('right', '0');
  p.style('left', '0');
  p.style('text-align', 'center');

  // Button 
  button = createButton(" I'm ready! ");
  button.mouseClicked(buttonFunction);
  button.style('text-decoration', 'none');
  button.style('background-color', '#B0FE76');
  button.style('border', 'none');
  button.style('font-size', '25px');
  button.style('position', 'absolute');
  button.style('bottom', '30%');
  button.style('left', '45%');
  button.style('text-align', 'center');
  button.style('border-radius', '45px');
  button.style('padding', '15px');
  button.style('padding-left', '25px');
  button.style('padding-right', '25px');

  //video feedback
  video = createCapture(VIDEO);
  video.hide();

  // Description / Instruction styling
  p3 = createP('Having a hard time finding a experimental font? Hit “ready”, take a few step back (around 2 meters from your webcam), do your best pose and generate your unique font.');
  p3.style('color', 'black');
  p3.style('font-size', '18px');
  p3.style('font-family', 'MonumentGrotesk');
  p3.style('position', 'fixed');
  p3.style('bottom', '0');
  p3.style('right', '0');
  p3.style('padding', '10px');

  //poseNet set up
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 1,
    task: 'regression',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

// PoseNet

function brainLoaded() {
  console.log('pose predicting ready!');
  predictWeight();
}

function predictWeight() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.predict(inputs, gotResult);
  } else {
    setTimeout(predictWeight, 100);
  }
}

function gotResult(error, results) {

  console.log(results);
  let weight = results[0].value;
  fontWeight.value(weight);
  predictWeight();

}

function gotPoses(poses) {
  // console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function buttonFunction() {
  timerCountdown();
  setTimeout(fontDownload, 6000);
}

// Countdown before getting the font from pose

function timerCountdown() {
  setInterval(function () {
    if (timerValue > 0) {
      timerValue--;
    }
  }, 1000);
}

// Button function to get the right font from pose

function fontDownload() {
  linkNum = map(fontWeight.value(), 100, 200, 100, 200);
  button.hide();
  l = createButton('Download your unique font!');
  l.mousePressed(downloadLink)
  l.style('background-color', '#B0FE76');
  l.style('border', 'none');
  l.style('font-size', '25px');
  l.style('position', 'absolute');
  l.style('bottom', '30%');
  l.style('left', '39%');
  l.style('text-align', 'center');
  l.style('border-radius', '45px');
  l.style('padding', '16px');
  l.style('padding-left', '25px');
  l.style('padding-right', '25px');
}

function downloadLink() {
  window.open('https://1998edo.shortcm.li/ssvar' + linkNum);
}

// Setting up the variable weight value of the font, video feedback & the countdown

function draw() {
  image(video, 0, 0, 200, 150);
  if (timerValue > 5) {
    text("", width / 2, height / 2);
    background('rgba(176,254,118, 0)');
  } if (timerValue < 5) {
    background('rgba(176,254,118, 1)');
    text(timerValue, width / 2, height / 2);
    textSize(100);
    textAlign(CENTER, CENTER);
  } if (timerValue == 0) {
    image(video, 0, 0, 200, 150);
  }
  let pfat = fontWeight.value();
  p.style('font-weight', pfat);
  //print(pfat);
}


