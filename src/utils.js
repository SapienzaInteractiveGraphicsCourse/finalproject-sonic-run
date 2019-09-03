//interpolation function
function lerp(current, target, fraction){

    var array_of_points = [];
  
    for (var is = 0; is < (1/fraction); is++){
      var j = is*fraction;
      array_of_points.push(current*(1-j)+target*j); 
    }
  
    return array_of_points;
  }

var loader = new THREE.GLTFLoader();
loader.crossOrigin = true;

var loader1 = new THREE.TextureLoader();

var scene;