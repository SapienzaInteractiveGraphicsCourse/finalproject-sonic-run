var max_distance = 50;
var min_gap = 12.5;
var probability = 0.5;
var rings = new Array();
var size = 5;
var lines_type = new Array(5);

function coin_curve(ring, start, group){
  var yy;
  var clone;
  var x = Math.floor(Math.random() * 4.5) - 2.25;
  for(var i = 0 ; i < size; i++){
    clone = ring.clone();
    if(i <= 2) yy = i*3/4 + 0.5;
    else yy -= 3/4;
    clone.id = group*size + i;
    clone.position.set(x , yy , start + i);
    scene.add(clone);
    rings.push(clone);
  }
}


function coin_line(ring, start, group){
  var x = Math.floor(Math.random() * 4.5) - 2.25;
  for(var i = 0; i < size; i++){
    var clone = ring.clone();
    clone.id = group*size + i;
    clone.position.set(x , 0.5 ,start + i);
    scene.add(clone);
    rings.push(clone);
  }
}


function randomCoinInitialization(ring){
  var gap = 0;
  for(i = 0; i < size; i++){

    var p = Math.random();
    gap += min_gap; 
    if(p <= probability){
      coin_curve(ring, gap, i);
      lines_type[i] = 1;
    }
    else{
      coin_line(ring, gap, i);
      lines_type[i] = 0;
    }
  }
}

function check_line(group, startx, startz){
  var xx = startx;
  var yy = 0.5;
  var zz = startz;
  for(i = 0; i < size; i++){
    for(j = 0; j < obs.length; j++){
      var z1 = zz <= obs[j].position.z + 2; 
      var z2 = zz >= obs[j].position.z - 2;
      if(obs[j].rotation.z == 80.1){ // horizontal
        var x1 = xx >= obs[j].position.x - error*8;
        var x2 = xx <= obs[j].position.x + error*8;
        var y = yy < 0.5 + error;
      }
      else{
          var x1 = xx >= obs[j].position.x - error;
          var x2 = xx <= obs[j].position.x + error;
          var y = true;
      }

      if(z1 && z2 && x1 && x2 && y){
        return false;
      }
    }

    if(lines_type[group] == 1){        
        if(i <= 2) yy = i*3/4 + 0.5;
        else if(i == 3) yy = 2*3/4 + 0.5 - 3/4;
        else yy = 0.5;
    }
    zz += 1;
  }
  return true;
}


function ringRepositioning(ring, parentid, id, group){
  // First of the line
  if(id == 0){
    var p = Math.random();
    if(p < probability) lines_type[group] = 1;
    else lines_type[group] = 0;

    var x;
    var z = ring.position.z + max_distance + min_gap;
    x = Math.floor(Math.random() * 4.5) - 2.25;
    if(!check_line(group, x, z)){
      //ringRepositioning(ring, parentid, id, group);
    }
    else {
      ring.position.x = x;
      ring.position.z = z;

      if(scene.getObjectById(ring.id) == null) scene.add(ring);
    }
  }
  // Following rings
  else{
    if(ring.position.z < rings[parentid].position.z){
      ring.position.x = rings[parentid].position.x;
      ring.position.z = rings[parentid].position.z + id;
      if(lines_type[group] == 1) { // rings curve
        
        if(id <= 2) yy = id*3/4 + 0.5;
        else if(id == 3) yy = 2*3/4 + 0.5 - 3/4;
        else yy = 0.5;

        ring.position.y = yy;

      } else ring.position.y = 0.5;    
      if(scene.getObjectById(ring.id) == null) scene.add(ring);
    }
  }
}

function check_ring(){
  var res, group;
  for(var i = 0; i < rings.length ; i++){
    r = rings[i];
    var id = i%size;
    var parent = i - id;
    group = Math.floor(i/size);

    if(scene.getObjectById(r.id) == null){
      ringRepositioning(r,parent,id, group);
      continue;
    }
    try {
      if(sonic.position.z >= r.position.z + 2) ringRepositioning(r, parent, id, group ); 
        z = sonic.position.z <= r.position.z + error;
        z1 = sonic.position.z >= r.position.z - error;

        y = sonic.position.y <= r.position.y + error;
        y2 = sonic.position.y >= r.position.y - error;

        x = sonic.position.x <= r.position.x + error;
        x2 = sonic.position.x >= r.position.x - error;
        if(z && z1 && x && x2 && y && y2){
          res = r;
          break;
        } else {
          res = -1;
        }
      } catch(err){
      }
    }
    if(res !=-1){
      score += 10;
      scene.remove(res);
      var i = rings.indexOf(r);
      var id = i%size;
      var parent = i- id;
      ringRepositioning(r, parent, id, group);
    }
}
