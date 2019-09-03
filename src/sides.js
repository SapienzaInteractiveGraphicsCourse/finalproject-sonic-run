var tree1, tree2, tree3, tree4;
var trees = new Array();
var max_trees = 30;
var tree_dist = 50;
var min_tree_dist = 20;

var objGeometry = new THREE.PlaneGeometry( 3 , 3 , 32);
var times_horizontal = 1;
var times_vert = 1;

var p = 0;


var SIDE_RES = 20;
var FLOOR_THICKNESS = 10;
var snoise = new ImprovedNoise();
var noiseScale = 2.7;
var noiseSeed = Math.random() * 100;


var cow1, cow2;
var mixer1, mixer2;
const mixers = [];
const clock = new THREE.Clock();

var SideConfig = {
  //const dimensions
  SIDE_WIDTH: 100,  // size of floor in x direction
  SIDE_DEPTH: 250,  //size of floor in z direction
  MOVE_STEP: 250    //z distance to move before recreating a new floor strip

};

loader1.load('./../Images/grass1.jpg', load_grass);

function load_grass(texture){
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  var times_horizontal = 20; 
  var times_vert = 80; 
  var objGeometry = new THREE.PlaneGeometry( SideConfig.SIDE_WIDTH, SideConfig.SIDE_DEPTH , SIDE_RES,SIDE_RES );
  texture.repeat.set(times_horizontal, times_vert);

  side1 = createSide(objGeometry,texture, 53 , 0);
  side2 = createSide(objGeometry,texture, -53 , 0);
  side3 = createSide(objGeometry,texture, 53 , 250);
  side4 = createSide(objGeometry,texture,-53 , 250);
}


loader.load('./../models/cow/scene.gltf', function(gltf) {
    cow1 = gltf.scene;
    cow1.name = "cow1";
    cow1.scale.set(0.008, 0.008, 0.008);
    cow1.position.set(5, 0, -10);
    cow1.rotation.y = 1.5;

    const animation = gltf.animations[0];

    mixer1 = new THREE.AnimationMixer( cow1 );
    mixers.push( mixer1 );

    const action = mixer1.clipAction( animation );
    action.play();
});

loader.load('./../models/cow/scene.gltf', function(gltf) {
    cow2 = gltf.scene;
    cow2.name = "cow2";
    cow2.scale.set(0.008, 0.008, 0.008);
    cow2.position.set(-5, 0, -10);
    cow2.rotation.y = 1.5;
    const animation = gltf.animations[0];

    mixer2 = new THREE.AnimationMixer( cow2 );
    mixers.push( mixer2 );

    const action = mixer2.clipAction( animation );
    action.play();
});

loader1.load('./../Images/tree.png', function(texture){
    texture.repeat.set(times_horizontal, times_vert);
    var objMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        transparent: true,
      });
    tree1 = new THREE.Mesh(objGeometry, objMaterial);
});

loader1.load('./../Images/tree1.png', function(texture){
    texture.repeat.set(times_horizontal, times_vert);
    var objMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        transparent: true,
      });
    tree2 = new THREE.Mesh(objGeometry, objMaterial);
});

loader1.load('./../Images/tree4.png', function(texture){
    texture.repeat.set(times_horizontal, times_vert);
    var objMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        transparent: true,
      });
    tree3 = new THREE.Mesh(objGeometry, objMaterial);
});

loader1.load('./../Images/tree5.png', function(texture){
    texture.repeat.set(times_horizontal, times_vert);
    var objMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        transparent: true,
      });
    tree4 = new THREE.Mesh(objGeometry, objMaterial);
});

function cowsRespawn(start){
  if(scene.getObjectByName(cow1.name) == null) scene.add(cow1);
  if(scene.getObjectByName(cow2.name) == null) scene.add(cow2);
  if(cow1.position.z < sonic.position.z - 10 && Math.random()>0.99){
    var x = Math.random()*4 + 3;
    var z = start + 50 + Math.random()*100 + 20;
    var rot;
    if(Math.random > 5) rot = 1.5;
    else rot = -1.5;
    cow1.rotation.y = rot;
    cow1.position.set(x, 0 , z);
  } 
  if (cow2.position.z < sonic.position.z - 10 && Math.random()>0.99){
    var x = Math.random()*4 + 3;
    var z = start + Math.random()*30 + 20 + Math.random()*80 + 20;
    var rot;
    if(Math.random > 5) rot = 1.5;
    else rot = -1.5;
    cow2.rotation.y = rot;
    cow2.position.set(-x, 0 , z);
  }
}


function createSide(floorGeometry,texture,posx, posz){
  var floorMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      color: 0x1df348,
      shading: THREE.FlatShading, 
      side: THREE.DoubleSide,
    });

  //add extra x width
  var floorGeometry = new THREE.PlaneGeometry( SideConfig.SIDE_WIDTH, SideConfig.SIDE_DEPTH , SIDE_RES,SIDE_RES );
  var floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
  floorMesh.rotation.x = Math.PI/2;
  floorMesh.position.y = 0;
  floorMesh.position.x = posx;
  floorMesh.position.z = posz;

  var i;
  var ipos;

  for( i = 0; i < SIDE_RES + 1; i++) {
    for( var j = 0; j < SIDE_RES + 1; j++) {
      ipos = i;
      if(posx > 0){
        if(i < 3 || i > SIDE_RES - 3) floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = 0; 
        else if(j < 3) floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = 0;
        else if(j < 7) floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = snoise.noise(ipos/SIDE_RES * noiseScale, j/SIDE_RES * noiseScale, noiseSeed ) * FLOOR_THICKNESS*j/4;
        else if(j > SIDE_RES - 3) floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = 0; 
        else floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = snoise.noise(ipos/SIDE_RES * noiseScale, j/SIDE_RES * noiseScale, noiseSeed ) * FLOOR_THICKNESS;        
      } else {
        if(i < 3 || i > SIDE_RES - 3) floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = 0; 
        else if(j< 3) floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = 0; 
        else if(j > SIDE_RES - 3)  floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z =  0;
        else if(j > SIDE_RES - 7) floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = snoise.noise(ipos/SIDE_RES * noiseScale, j/SIDE_RES * noiseScale, noiseSeed ) * FLOOR_THICKNESS*(-j+SIDE_RES)/5; 
        else floorGeometry.vertices[i * (SIDE_RES + 1)+ j].z = snoise.noise(ipos/SIDE_RES * noiseScale, j/SIDE_RES * noiseScale, noiseSeed ) * FLOOR_THICKNESS;
      }
    }
  }
  floorGeometry.verticesNeedUpdate = true;
  return floorMesh;

}


function treesInit(){
    for(var m = 0; m < max_trees;){
        var road_side = (Math.random() > 0.5 ? -1 : 1);
        var px = road_side*Math.random()*10 +(road_side == -1 ? -3 : 3);
        var pz = Math.random()*tree_dist + 10;
        var put = true;
        for(var l = 0; l < trees.length; l++){
            var x1 = px <= trees[l].position.x + error*3;
            var x2 = px >= trees[l].position.x - error*3;
            var z1 = pz <= trees[l].position.z + error*3;
            var z2 = pz >= trees[l].position.z - error*3;
            if(x1 && x2 && z1 && z2){
                put = false;
                break;
            }
        }

        if(put){ 
            if( p == 0 ){
                c = tree1.clone();
                c.position.set(px, 1.5 , pz);
                p++;
            } else if( p == 1 ){
                c = tree2.clone();
                c.position.set(px, 1.2 , pz);
                p++;
            } else if( p == 2 ){
                c= tree3.clone();
                c.position.set(px, 1.2 , pz);
                p++;
            } else {
                c = tree4.clone();
                c.position.set(px, 1.2 , pz);
                p = 0;
            }        
            if(road_side > 0) c.rotation.y = 0.6;
            else c.rotation.y = -0.6;
            trees.push(c);
            scene.add(c);
            m++;
        } 
    }
}

function treesRepositioning(start){
    for(var i = 0; i < trees.length; i++){
        if(trees[i].position.z + 1 < sonic.position.z ){
            var road_side = (Math.random() > 0.5 ? -1 : 1);
            var px = road_side*Math.random()*10 +(road_side == -1 ? -3 : 3) ;
            var pz = Math.random()*tree_dist + start + min_tree_dist;
            var put = true;
            for(var l = 0; l < trees.length; l++){
                var x1 = px <= trees[l].position.x + error*3;
                var x2 = px >= trees[l].position.x - error*3;
                var z1 = pz <= trees[l].position.z + error*3;
                var z2 = pz >= trees[l].position.z - error*3;
                if(x1 && x2 && z1 && z2){
                    put = false;
                    break;
                }
            }

            if(put){
                scene.remove(trees[i]);
                trees.splice(i,1);
                if( p == 0 ){
                    c = tree1.clone();
                    c.position.set(px, 1.5 , pz);
                    p++;
                } else if( p == 1 ){
                    c = tree2.clone();
                c.position.set(px, 1.2 , pz);
                    p++;
                } else if( p == 2 ){
                    c= tree3.clone();
                    c.position.set(px, 1.2 , pz);
                    p++;
                } else {
                    c = tree4.clone();
                    c.position.set(px, 1.2 , pz);
                    p = 0;
                }
                if(road_side > 0) c.rotation.y = 0.6;
                else c.rotation.y = -0.6;
                trees.push(c);
                scene.add(c);
            } 
        }
    }
}

