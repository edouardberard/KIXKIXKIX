//Credits
// Most of code from "ml5.js: Pose Regression" by The Coding Train / Daniel Shiffman
// Modified to adapt variable font

// Info : 
// prefix "p1" for styling the font

let video;
let poseNet;
let pose;
let skeleton;
let brain;
let fontWeight;

function setup() {
  createCanvas(0, 0);
  fontWeight = createSlider(100, 200, 100);
  //fontWeight.hide();
  p = createP('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  p.style('position','absolute');
  p.style('top', '30%');
  p.style('margin-left', 'auto');
  p.style('margin-right', 'auto');
  p.style('right', '0');
  p.style('left', '0');
  p.style('text-align','center');
  button = createButton("I'm ready!");
  button.mouseClicked(fontDownload);
  button.style('text-decoration','none');
  button.style('background-color','white');
  button.style('border','none');
  button.style('font-size','25px');
  button.style('position','absolute');
  button.style('bottom','30%');
  button.style('left','45%');
  button.style('text-align','center');
  video = createCapture(VIDEO);
  //video.size(200, 150);
  video.style('padding','10px');
  video.style('position','fixed');
  video.style('bottom','0');
  video.style('left','0');
  p3 = createP('Having a hard time to choose a font? Hit “ready” do your best pose and generate your unique font.');
  p3.style('color','black');
  p3.style('font-size', '18px');
  p3.style('font-family', 'MonumentGrotesk');
  p3.style('position','fixed');
  p3.style('bottom','0');
  p3.style('right','0');
  p3.style('padding','10px');
  //video.hide();
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

function fontDownload() {
  //await delay(3000);
  linkNum = map(fontWeight.value(),100,200,100,200);
  l = createA('https://1998edo.shortcm.li/ssvar'+linkNum, 'Download your unique font!');
  l.style('font-family','MonumentGrotesk')
  l.style('font-size', '18px');
  l.style('text-decoration','none');
  l.style('position','absolute');
  l.style('bottom','20%');
  l.style('left','45%');
  l.style('text-align','center');
}

function draw() {
  let pfat = fontWeight.value();
  p1.style('font-weight', pfat);
}