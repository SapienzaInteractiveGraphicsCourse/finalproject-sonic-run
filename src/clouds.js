var cloud;
loader1.load('./../Images/cloud10.png', function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
      
    var times_horizontal = 1; 
    var times_vert = 1; 
      
    var objGeometry = new THREE.PlaneGeometry( 10 , 10 , 32);
    texture.repeat.set(times_horizontal, times_vert);
    var objMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        transparent: true,
    });
    cloud = new THREE.Mesh(objGeometry, objMaterial);
}, null , null);

var max_clouds = 50;
var clouds = new Array();

function cloudsCollision(x, y, z){
  for(i = 0; i < clouds.length; i++){
    var x1 = x <= clouds[i].position.x + 10;
    var x2 = x >= clouds[i].position.x - 10;
    var y1 = y <= clouds[i].position.y + 5;
    var y1 = y >= clouds[i].position.y - 5;
    var z1 = z <= clouds[i].position.z + 10;
    var z2 = z >= clouds[i].position.z - 10;

    if(x1 && x2 && y1 && y2 && z1 && z2) return true;
  }
  return false;
}

function spawnClouds(start){
  var aux = start;
  for(i = 0; i < max_clouds; i++){
    var clone = cloud.clone();
    var x = Math.floor(Math.random()*180 - 90);
    var y = Math.floor(Math.random()* 5 + 16);
    var z = 10 + aux;
    clone.position.set(x, y , z);
    clone.scale.x = 4;
    clouds.push(clone);
    scene.add(clouds[i]);
    aux += 8;
  }
}

function checkClouds(){
  for(i = 0; i < clouds.length; i++){
    if(clouds[i].position.z + 3 < sonic.position.z){
      cloudRepositioning(clouds[i]);
    }
  }
}


function cloudRepositioning(cloud){
  var x = Math.floor(Math.random()*180 - 90);
  var y = Math.floor(Math.random()* 5 + 16);
  var z = sonic.position.z + 400 + Math.floor(Math.random()*150);

  if(!cloudsCollision(x,y,z)) cloud.position.set(x,y,z);
}
