const backgroundColor = 0x000000;

// variable section
var score = 0;
var light;
var dead_step = 0;

var renderer, camera, controls;
var t = 0;

var ground1, ground2;
var side1, side2, side3, side4;
var bg, bg1;

var items_probability = 0.999;

var current_frame;
var invincibility_frames = 20; // duration of a "tic", the actual number of invincibility frames is 3*invincibility_frames

var times = 1; 

var pain = new Audio('./../audio/pain.mp3');
pain.volume = 0.4;

// scene creation and main light positioning
function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 800 );
  camera.position.set(0,2,-4);

  var container = document.getElementById('game');

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( backgroundColor );//0x );

  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = Math.pow( 0.94, 5.0 );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );

  container.appendChild( renderer.domElement);

  controls = new THREE.OrbitControls( camera );
  controls.enabled = false;

  var light1 = new THREE.AmbientLight( 0xffffff, 1.4 , 1);
  light1.position.set( 30, 10, 30  );
  scene.add(light1);

  light = new THREE.SpotLight( 0xffffff, 1.2, 0, 1.2);
  light.position.set( -0.5, 20, -5  );
  light.castShadow = true;
  scene.add( light );

    //Set up shadow properties for the light
  light.shadow.mapSize.width = 1024;  // default
  light.shadow.mapSize.height = 1024; // default
  light.shadow.camera.near = 0.5;       // default
  light.shadow.camera.far = 8000;     // default
  light.shadow.camera.fov = 30;



  // Initialization of the world
  spawnClouds(0);
  treesInit();  
  scene.add(side1);
  scene.add(side2);
  scene.add(side3);
  scene.add(side4);
}

//loading models

loader.load( './../models/scene.gltf', function ( gltf ) {
    sonic = gltf.scene;
    sonic.name = "sonic";
    sonic.position.set(0, 0, -0.75);
    sonic.castShadow = true;
    sonic.receiveShadow = true;

    light.target = sonic;

    sonic.getObjectByName(sonic_dic.Indice_lower_sx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Indice_upper_sx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Medio_lower_sx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Medio_upper_sx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Mignolo_lower_sx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Mignolo_upper_sx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Anulare_lower_sx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Anulare_upper_sx).rotation.z = 1;    
    sonic.getObjectByName(sonic_dic.Pollice_lower_sx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Pollice_upper_sx).rotation.z = 0.5;
    sonic.getObjectByName(sonic_dic.Indice_lower_dx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Indice_upper_dx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Medio_lower_dx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Medio_upper_dx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Mignolo_lower_dx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Mignolo_upper_dx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Anulare_lower_dx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Anulare_upper_dx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Pollice_lower_dx).rotation.z = 2;
    sonic.getObjectByName(sonic_dic.Pollice_upper_dx).rotation.z = 1;
    sonic.getObjectByName(sonic_dic.Braccio_dx).rotation.y = -1.5;
    sonic.getObjectByName(sonic_dic.Braccio_sx).rotation.y = 1.5;
    sonic.getObjectByName(sonic_dic.Testa).rotation.z = 0.2;
    scene.add(sonic);

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
      keyCode = event.keyCode;
      if (keyCode == 65 && sonic.position.x < 2.5 && dead_step == 0) {
        sonic.position.x += 0.5;
      } else if (keyCode == 68 && sonic.position.x > -2.5 && dead_step == 0) {
        sonic.position.x -= 0.5;
      } else if (keyCode == 32 && dead_step == 0){
        jump = true;
      }
    };
});

loader.load( "./../models/tails/scene.gltf", function(gltf){
  tails = gltf.scene;
  tails.rotation.y = 3.1;
  tails.getObjectByName(tails_dic.Braccio_dx).rotation.y = -0.5;
  tails.getObjectByName(tails_dic.Braccio_sx).rotation.y = 0.5;
  tails.position.set(0 , -3, 0);
  scene.add(tails);
});


loader.load('./../models/ring.glb', function(gltf) {
    var ring = gltf.scene;
    ring.scale.set(0.005,0.005,0.005);
    randomCoinInitialization(ring);
    generate_obstacle();
});

loader.load( './../models/eggman-yurro.glb', function ( gltf ) {
  eggman = gltf.scene;
  eggman.position.set(0, 0, -100);
  eggman.scale.set(0.5,0.5,0.5);
  scene.add( eggman );
  scene.add(alarm);
});

// score text display
var text = document.createElement('h1');
text.style.position = 'absolute';
text.style.color = "black";
text.style.height = 40 + 'px';
text.style.top = 0 + 'px';
text.style.left = 40 + 'px';
document.body.appendChild(text);

// function launched after damage 
function damage_feedback(){
  invincibility = true;
  current_frame = 0;
  pain.play();
}

// animation loop during the game
function animate(){
  if(typeof(sonic) != 'undefined' && typeof(tails) != 'undefined'){
    delete_obs(); // reposition of obstacles behind sonic
    break_walls();

    if(s < 0.2){
      s += 0.000005;
      egg_speed += 0.000005;
    }

    sonic.position.z += s;
    camera.position.z += s;
    light.position.z += s;
    bg.position.z += s;
    bg1.position.z += s;
    heart.rotation.y += 0.05;

    if(cow1 != undefined && cow2 != undefined) {
      cowsRespawn(sonic.position.z);
    }

    if(clock != undefined){
      const delta = clock.getDelta();
      for ( const mixer of mixers ) {
          mixer.update( delta );
      }}

    // Infinite road
    if(sonic.position.z >= 125*times + 10){
      if(times % 2 == 0){
        ground2.position.z += 250;
        side3.position.z += 250;
        side4.position.z += 250;

      }
      else{ 
        ground1.position.z += 250;
        side1.position.z += 250;
        side2.position.z += 250;
      }
      times += 1;
    }

    getHeart();
    getshield();
    update_shield();

 

    // Damage feedback
    if(invincibility == true && shield_on == false){
      if(scene.getObjectByName(sonic.name) != null && (current_frame == 0 || current_frame == 2*invincibility_frames || current_frame == 4*invincibility_frames)){
        scene.remove(sonic);      }
      else if(scene.getObjectByName(sonic.name) == null && (current_frame == invincibility_frames || current_frame == 3*invincibility_frames || current_frame == 5*invincibility_frames-1)){
        scene.add(sonic);
      }
      current_frame += 1;
      if(current_frame >= 5 * invincibility_frames) {
        invincibility = false;
        current_frame = 0;
      }
    }

    checkClouds();
    move_sonic();

    if(spawn_tails) spawnTails();
    if(can_move_tails) move_tails(t);

    if((sonic.position.z + 3) % 150 <= 1) eggman_spawn();
    eggman_moves();

    if(robot_to_spawn == true) spawn_robot();

    if(robot_to_spawn == false) robotEnemy();

    t = (t >= run[0].length) ? 0 : t+=1;

    check_ring(); 
    collision();

    text.innerHTML = "Score: " + score;

    turn_off_eggman();
    spawn_shield(sonic.position.z);
    treesRepositioning(sonic.position.z);
  } 

  if(dead_step){
   requestAnimationFrame(death);
  } else {
    requestAnimationFrame(animate);
  }
  render();

}

// texture loader function and calls
var onLoad = function (texture) {
  var n = texture.image.src.slice(-8,-4);

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  var times_horizontal; 
  var times_vert; 

  var objGeometry;
  if(n == 'road'){
    objGeometry = new THREE.PlaneGeometry(6,250, 32);
    times_horizontal = 1;
    times_vert = 50;
  } else if(n =='ope1'){
    objGeometry = new THREE.PlaneGeometry( 800 , 150 , 32);
    times_horizontal = 1;
    times_vert = 1;
  }

  texture.repeat.set(times_horizontal, times_vert);

  if(n =='road'){
    var objMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading,
    });

    ground1 = new THREE.Mesh(objGeometry, objMaterial);
    ground1.rotation.x = 300.0221;
    ground1.receiveShadow = true;
    scene.add(ground1);      

    ground2 = ground1.clone();
    ground2.receiveShadow = true;
    ground2.position.z = 250;
    scene.add(ground2);
  

  } else if(n=='ope1'){
    var objMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
     // shading: THREE.FlatShading,
    });

    bg = new THREE.Mesh(objGeometry, objMaterial);
    bg.position.set( 0 , 69, 250);
    bg1 = bg.clone();
    bg1.position.set( -20 , 40, -250);
    scene.add(bg);
    scene.add(bg1);   
  } 
}


// Function called when download progresses
var onProgress = function (xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
};

// Function called when download errors
var onError = function (xhr) {
  console.log(xhr);
};

loader1.load('./../Images/road.jpg', onLoad, onProgress, onError);
loader1.load('./../Images/landscope1.jpg', onLoad, onProgress, onError);


function render(){ 
  renderer.render(scene, camera);
}

// main call for game setting and starting
init();
animate();