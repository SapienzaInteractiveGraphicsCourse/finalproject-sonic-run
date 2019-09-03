var alarm;
var eggman;

loader1.load('./../Images/alert.png', function(texture){
  var objGeometry = new THREE.PlaneGeometry( 1 , 1 , 32);
  var objMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading,
      transparent: true,
    });
  alarm = new THREE.Mesh(objGeometry, objMaterial);
  alarm.rotation.x = 300.0221;
  alarm.rotation.z = 3.1;
  alarm.visible = false;
});

var wait = 0;
var e = false;

var t_egg = 0;
var t_jump = 0;

var egg_speed = 0.12;
var eggman_moves_x = lerp( 0 , -2.25, run_speed/6).concat(lerp(-2.25,2.25,run_speed/3)).concat(lerp(2.25,0,run_speed/6));
var egg = false;
var hitting = false;
var n_hit = 0;
var max_hit = 5;

var laugh = new Audio('../audio/laugh.mp3');
var challenging = new Audio('../audio/challenging.mp3');
var letgo = new Audio('../audio/letgo.mp3');
var won = new Audio('../audio/won.mp3');
var wontescape = new Audio('../audio/wontescape.mp3');
var that = new Audio('../audio/that.mp3');
var cantwin = new Audio('../audio/youcantwin.mp3');


function check_eggman(oldv){
  if(oldv || (wait != 0 && wait < 80)){
    wait +=1;
  } else {
    v = eggman.position.z <= sonic.position.z + error;
    v2 = eggman.position.z >= sonic.position.z - error;
    v3 = eggman.position.x <= sonic.position.x + error;
    v4 = eggman.position.x >= sonic.position.x - error;
    wait = 0;
    if(v && v4 && v2 && v3) return true;
  }
  return false;
}

function eggman_spawn(){
    if(!egg){
      egg = true;
      eggman.position.z = sonic.position.z - 5;
      alarm.position.set(eggman.position.x , 0.1 , sonic.position.z - 0.1 );
      alarm.visible = true;
      if(Math.random() > 0.5) laugh.play();
      else wontescape.play();
    }
}

var played_retreat = false;

function eggman_moves(){
    if(egg){
      eggman.position.x = eggman_moves_x[t_egg]
      alarm.position.set(eggman.position.x , 0.1 , sonic.position.z - 0.1 );
          
      //here that should be a random movement towards sonic to hit him
      if(eggman.position.z >= sonic.position.z + 4){ //we're in front of sonic
        hitting = Math.random() > 0.95; //probability of trying to hit
      } else if(hitting == false){
        eggman.position.z += egg_speed;
      }

      if(hitting){
        eggman.position.z -= egg_speed; //going back towards sonic
        if(eggman.position.z <= camera.position.z + 1){ // after going to him, we set time and variable, he'll go back to its z position
          n_hit +=1;
          hitting = false;
        }
      }

      t_egg = (t_egg >= eggman_moves_x.length) ? 0 : t_egg+1;

      if(n_hit >= max_hit-1 && !played_retreat && !isPlaying(challenging)){
          if(Math.random() > 0.5) letgo.play();
          else won.play();
          played_retreat = true;
        }
      // we must decide how make it go away, even with a cycle of movements 
      if(n_hit == max_hit){
        
        eggman.position.z = camera.position.z;
        n_hit = 0;
        egg = false;
        played_retreat = false;
        cantwin.play();
      }

      if(!invincibility) {
        e = check_eggman(e);
        if(e){
          if(!played_retreat){
            if(Math.random() > 0.5) challenging.play();
            else that.play();
          }
          getDamage();
          damage_feedback();
        }
      }
      //else if(e && score == 0) window.alarm("GAME OVER");
    } 
}

function isPlaying(audio) { return !audio.paused; }

function turn_off_eggman(){
    if(eggman.position.z > sonic.position.z){
      alarm.visible = false;
    }
}
