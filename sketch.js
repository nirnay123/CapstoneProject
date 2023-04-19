const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Composite= Matter.Composite;

let engine;
let world;

//declaring variables
var ground, leftw, rigthw, topw;
var pac_man, pacImg;
var score=0, start_btn, gamestate="start", mute_btn;
var pellets=[], pellet;
var catchSound, crashSound, bg_music;

function preload(){
  //Loading images
  pacImg=loadImage('assets/pac_Man.png');
  pImg= loadImage('assets/pellet.png');

//Loading sounds
  catchSound=loadSound("assets/catch.wav");
  crashSound=loadSound("assets/collided.wav");
  bg_music=loadSound("assets/bgMusic.wav");
}

function setup(){
  engine=Engine.create();
  world=engine.world;

  gamestate= "start";

  //OPTIONS
  var static_o={
    isStatic:true
  };
  var pac_o={
    restitution:0.7,
    frictionAir:0.02
  };
  
  //creating canvas
  createCanvas(windowWidth,windowHeight); 

  //BUTTONS
  start_btn= createImg('assets/startbtn.png');
  start_btn.position(width/2 - 100, height/2);
  start_btn.size(200,100);
  start_btn.mouseClicked(start);

  mute_btn= createImg('assets/mute.png');
  mute_btn.position(width - 65, 35);
  mute_btn.size(30,30);
  mute_btn.mouseClicked(mute);

  //walls
  ground= new Ground(width/2, height-15, width, 30);
  leftw=new Ground(15, height/2, 30, height-60);
  rigthw= new Ground(width-15, height/2, 30, height-60);
  topw= new Ground(width/2, 15, width, 30);
  
  //pacman
  pac_man= Bodies.circle(width/2,height/2, 27, pac_o);
  World.add(world, pac_man);
  pa_spr=createSprite(pac_man.position.x,pac_man.position.y,54,54);
  pa_spr.addImage("pacimg",pacImg);

  pellet= createSprite(width/3,height/3,10,10);
  pellet.addImage("pimg", pImg);

  rectMode(CENTER);
  ellipseMode(CENTER);
  imageMode(CENTER)
}

function draw(){
  background(1);
  Engine.update(engine);

  pa_spr.x=pac_man.position.x;
  pa_spr.y=pac_man.position.y;

  //text
  textSize(20);
  text("Score: " + score, width-200, 70);
  text("Do not touch the walls and touch the pellet as many times as you can", 70,70);
  text("using arrow keys.", 70,100);
  
  //WALLS
  ground.show();
  leftw.show();
  rigthw.show();
  topw.show();

  if(gamestate== "play"){
    pelletCollide();
    pacMove();
    pelletControl();
  }
  
  //ENDING THE GAME
  if(gamestate=="play"){
    if(pac_man.position.y<57 ||
       pac_man.position.y>height-57 ||
       pac_man.position.x<57 ||
       pac_man.position.x>width-57){
       gamestate="end";
       console.log("ended");
       crashSound.play();
       pellet.velocityX=0;
       pellet.velocityY=0;
       bg_music.stop();
    }
  }  

  if(gamestate === "end"){
    pac_man.velocityX=0;
    pac_man.velocityY=0;
    gameOver();
  }

  drawSprites();
}

//Locomotion
function pacMove(){
  if(keyDown("UP_ARROW")){
    Matter.Body.applyForce(pac_man, {x:0, y:0}, {x:0,y:-0.03});
  }
  if(keyDown("LEFT_ARROW")){
    Matter.Body.applyForce(pac_man, {x:0, y:0}, {x:-0.03,y:0});
  }
  if(keyDown("RIGHT_ARROW")){
    Matter.Body.applyForce(pac_man, {x:0, y:0}, {x:0.03,y:0});
  }
  if(keyDown("DOWN_ARROW")){
    Matter.Body.applyForce(pac_man, {x:0, y:0}, {x:0,y:0.03});
  }
}
//BUTTON FUNCTIONS
function start(){
  start_btn.remove();
  gamestate= "play";
  Matter.Body.applyForce(pac_man, {x:0, y:0}, {x:0,y:-0.06});
  //background music
  bg_music.loop();
  bg_music.setVolume(0.5);
}
function mute(){
  if(bg_music.isPlaying()){
    bg_music.stop();
  }
  else{
    bg_music.loop();
  }
}

//PELLET FUNCTIONS
function pelletCollide(){
  if(pellet.isTouching(pa_spr)){
    pellet.x+=100;
    pellet.y+=100;
    score+=1;
    catchSound.play();
  }
}
function pelletControl(){
  pellet.velocityY=random(25,-25);
  pellet.velocityX=random(25,-25);
  if(pellet.x<57){
      pellet.x+=100;
  }
  if(pellet.x>width-57){
      pellet.x-=100;
  }
  if(pellet.y<57){
    pellet.y+=100;
  }
  if(pellet.y>height-57){
    pellet.y-=100;
  }
}

//GAMEOVER function
function gameOver() {
  //sweetalert
  swal(
    {
      //text to be shown
      title: `Game Over!!!`,
      text: "Thanks for playing!!",
      //image to be shown
      imageUrl:
        "assets/redGhost.png",
      imageSize: "150x150",
      //button
      confirmButtonText: "Play Again"
    },
    //if button is pressed
    function(isConfirm) {
      if (isConfirm) {
        //reset
        location.reload();
      }
    }
  );
  }

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}