var distance = 30;
var min_distance = 10;
var shield_time = 0;
var shield_to_spawn = true;
var vanishing = true;
var sgeometry = new THREE.SphereGeometry( 0.5 , 32, 32 );
var smaterial = new THREE.MeshPhongMaterial({
  color: 0x0c67fb,
  opacity: 0.35,
  transparent : true,
});
var shield = new THREE.Mesh( sgeometry, smaterial );
shield.position.set(0,0,-10);
shield.visible = false;
var initialization = true;

var shield_on = false;

function spawn_shield(start){
    if(shield_to_spawn && Math.random() > items_probability){
        var px = (Math.random() > 0.5 ? -1 : 1)*Math.random()*2.5;
        var py = (Math.random() + 0.5);
        var pz = Math.random()*distance + min_distance + start;

        var put = true;
        for(var i = 0 ; i < rings.length; i++){
            var z = pz <= rings[i].position.z + error;
            var z1 = pz >= rings[i].position.z - error;
            var y = py <= rings[i].position.y + error;
            var y1  = py >= rings[i].position.y - error;
            var x = px <= rings[i].position.x + error;
            var x2 = px >= rings[i].position.x - error;
            if(z && z1 && x && x2 && y && y1){
                put = false;
                break;
            }
        }

        for(i = 0 ; i < obs.length; i++){
            var z = pz <= obs[i].position.z + error;
            var z1 = pz >= obs[i].position.z - error;
            if(obs[i].rotation.z == 80.1){ // horizontal
                var x1 = px >= obs[i].position.x - error*2.5;
                var x2 = px <= obs[i].position.x + error*2.5;
                var y = py < 0.5 + error;
            } else { // vertical 
                var x1 = px >= obs[i].position.x - error;
                var x2 = px <= obs[i].position.x + error;
                var y = true;
            }
            if(z && z1 && x1 && x2 && y){
                put = false;
                break;
            }
        }

        var x1 = px <= heart.position.x + error;
        var x2 = px >= heart.position.x - error;
        var z1 = pz <= heart.position.z + error;
        var z2 = pz >= heart.position.z - error;
        var y1 = py <= heart.position.y + error;
        var y2 = py >= heart.position.y - error;
        if(x1 && x2 && z1 && z2 && y1 && y2) put = false;
        
        if(put){
            shield.position.set(px, py, pz);
            shield.visible = true;
            shield_to_spawn = false;
            if(initialization){
                scene.add(shield);
                initialization = false;
            }
        } else {
            spawn_shield(start);
        }
    }
}

function getshield(){
    var z = sonic.position.z <= shield.position.z + 0.7;
    var z1 = sonic.position.z >= shield.position.z - 0.7;
    var y = sonic.position.y <= shield.position.y + error*2;
    var y2 = sonic.position.y >= shield.position.y - error*2;
    var x = sonic.position.x <= shield.position.x + 0.7;
    var x2 = sonic.position.x >= shield.position.x - 0.7;
    if(z && z1 && y && y2 && x && x2 && !shield_on){
        invincibility = true;
        shield_on = true;
        if(scene.getObjectByName("sonic") == null) scene.add(sonic);

    }
}

function remove_shield(){
    invincibility = false;
    shield_on = false;
    shield.position.set(0,0,-10);
    shield_time = 0;
    shield_to_spawn = true;
    shield.visible = false;
}

function update_shield(){
    if(shield_on){
        shield.position.set(sonic.position.x, sonic.position.y + 0.5, sonic.position.z);
        shield_time +=1;
        if(scene.getObjectByName("sonic") == null) scene.add(sonic);
    } else if(shield_on == false && shield_to_spawn == false && shield.position.z < sonic.position.z){
        shield_to_spawn = true;
        shield.visible = false;
    }

    if(shield_time == 480){
        remove_shield();
    } else if( shield_time >= 420 && shield_time%10 == 0){
        if(vanishing){
            scene.remove(shield); vanishing = false;
        } else {
            scene.add(shield); vanishing = true;
        }
    }

}
