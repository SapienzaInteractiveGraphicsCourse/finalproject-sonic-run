var heart;
var can_get_heart = false;
var max_hearts = Number(document.URL.substr(-1,1));
var num_hearts = max_hearts;

var remach = new Audio('./../audio/remach.mp3');

var life1 = document.createElement('img');
life1.style.position = 'absolute';
life1.src = './../Images/life.png';
life1.style.height = 40 + 'px';
life1.style.top = 20 + 'px';
life1.style.right = 190 + 'px';

var life2 = document.createElement('img');
life2.style.position = 'absolute';
life2.src = './../Images/life.png';
life2.style.height = 40 + 'px';
life2.style.top = 20 + 'px';
life2.style.right = 140 + 'px';

var life3 = document.createElement('img');
life3.style.position = 'absolute';
life3.src = './../Images/life.png';
life3.style.height = 40 + 'px';
life3.style.top = 20 + 'px';
life3.style.right = 90 + 'px';

var life4 = document.createElement('img');
life4.style.position = 'absolute';
life4.src = './../Images/life.png';
life4.style.height = 40 + 'px';
life4.style.top = 20 + 'px';
life4.style.right = 40 + 'px';

loader.load( './../Models/heart/scene.gltf', function ( gltf ) {
    heart = gltf.scene;
    heart.name = "heart";
    heart.visible = true;
    heart.position.set(0, -5, 5);
    heart.scale.set(0.007, 0.007, 0.007);

    if(max_hearts == 4){
        document.body.appendChild(life4);
        document.body.appendChild(life3);
        document.body.appendChild(life2);
        document.body.appendChild(life1);
    } else if(max_hearts == 3){
        document.body.appendChild(life4);
        document.body.appendChild(life3);
        document.body.appendChild(life2);
    } else if(max_hearts == 2){
        document.body.appendChild(life4);
        document.body.appendChild(life3);
    } else {
        document.body.appendChild(life4);
    }

    scene.add(heart)
});

function heartSpawn(start){
    if(Math.random() > items_probability){
        var px =  Math.floor(Math.random() * 4.5) - 2.25;
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

        var x1 = px <= shield.position.x + error;
        var x2 = px >= shield.position.x - error;
        var z1 = pz <= shield.position.z + error;
        var z2 = pz >= shield.position.z - error;
        var y1 = py <= shield.position.y + error;
        var y2 = py >= shield.position.y - error;
        if(x1 && x2 && z1 && z2 && y1 && y2) put = false;
        
        if(put){
            heart.visible = true;
            heart.position.set(px, py, pz);
        } else {
            heartSpawn(start);
        }
    }
}


function getDamage(){
    
    if(max_hearts == 4){
        if(life4.src.slice(-10,-4) != 'nolife'){
            life4.src = './../Images/nolife.png';
            can_get_heart = true;
            return;
        } else if(life3.src.slice(-10,-4) != 'nolife'){
            life3.src = './../Images/nolife.png';
            can_get_heart = true;
            return;
        } else if(life2.src.slice(-10,-4) != 'nolife'){
            life2.src = './../Images/nolife.png';
            return;
        } else if(life1.src.slice(-10,-4) != 'nolife'){
            life1.src = './../Images/nolife.png';
            dead_step += 1;
            return;
        }
    } else if(max_hearts == 3){
        if(life4.src.slice(-10,-4) != 'nolife'){
            life4.src = './../Images/nolife.png';
            can_get_heart = true;
            return;
        } else if(life3.src.slice(-10,-4) != 'nolife'){
            life3.src = './../Images/nolife.png';
            return;
        } else if(life2.src.slice(-10,-4) != 'nolife'){
            life2.src = './../Images/nolife.png';
            dead_step += 1;
            return;
        }
    } else if(max_hearts == 2){
        if(life4.src.slice(-10,-4) != 'nolife'){
            life4.src = './../Images/nolife.png';
            can_get_heart = true;
            return;
        } else if(life3.src.slice(-10,-4) != 'nolife'){
            life3.src = './../Images/nolife.png';
            dead_step += 1;
            return;
        } 
    } else {
        if(life4.src.slice(-10,-4) != 'nolife'){
            life4.src = './../Images/nolife.png';
            dead_step += 1;
            return;
        }
    }
}


function check_lives(){
    if(life1.src.slice(-10,-4) == 'nolife'){
        life1.src = './../Images/life.png';        
        return;    
    } else if(life2.src.slice(-10,-4) == 'nolife'){
        life2.src = './../Images/life.png';
        return;
    } else if(life3.src.slice(-10,-4) == 'nolife'){
        life3.src = './../Images/life.png';
        return;
    } else if(life4.src.slice(-10,-4) == 'nolife'){
        life4.src = './../Images/life.png';
        can_get_heart = false;
        return;
    }
    return;
}


function getHeart(){

    if(heart.position.z + 3 < sonic.position.z) {
        heartSpawn(sonic.position.z);
        return;
    }

    var z = sonic.position.z <= heart.position.z + 0.7;
    var z1 = sonic.position.z >= heart.position.z - 0.7;
    var y = sonic.position.y <= heart.position.y + error*2;
    var y2 = sonic.position.y >= heart.position.y - error*2;
    var x = sonic.position.x <= heart.position.x + 0.7;
    var x2 = sonic.position.x >= heart.position.x - 0.7;
    if(z && z1 && y && y2 && x && x2 && can_get_heart){
        check_lives();
        heart.position.z -= 2;
        heart.visible = false;
        heartSpawn(sonic.position.z);
    }
}

function death(){
    dead_step += 1;

    if(dead_step < 70){

        sonic.getObjectByName(sonic_dic.Polpaccio_dx).rotation.z = run[1][(t + dead_step)%run[0].length];
        sonic.getObjectByName(sonic_dic.Coscia_dx).rotation.z = run[0][(t + dead_step)%run[0].length];
        sonic.getObjectByName(sonic_dic.Polpaccio_sx).rotation.z = run[3][(t + dead_step)%run[0].length];
        sonic.getObjectByName(sonic_dic.Coscia_sx).rotation.z = run[2][(t + dead_step)%run[0].length];
        sonic.getObjectByName(sonic_dic.Avambraccio_sx).rotation.z = run[4][(t + dead_step)%run[0].length];
        sonic.getObjectByName(sonic_dic.Avambraccio_dx).rotation.z = run[5][(t + dead_step)%run[0].length];
        sonic.getObjectByName(sonic_dic.Braccio_dx).rotation.z = run[6][(t + dead_step)%run[0].length];
        sonic.getObjectByName(sonic_dic.Braccio_sx).rotation.z = run[7][(t + dead_step)%run[0].length];
        
        if(jump){
            sonic.position.y = jump_points[t_jump];
            t_jump += 1;
            if(t_jump >= jump_points.length){
              jump = false;
              t_jump = 0;
            }
          }
        
        sonic.position.z += s/2;
        camera.position.z += s/2;
        light.position.z += s/2;
        bg.position.z += s/2;

        requestAnimationFrame(death);

    } else if (dead_step == 70){
        remach.play();

        camera.position.z += 5;
        camera.position.y = 1;
        camera.position.x = sonic.position.x;
        camera.rotation.x -= 1;
        camera.rotation.y = 3.1;

        sonic.getObjectByName(sonic_dic.Braccio_dx).rotation.z = 0;
        sonic.getObjectByName(sonic_dic.Braccio_dx).rotation.y = - 1;
        sonic.getObjectByName(sonic_dic.Avambraccio_dx).rotation.z = 0;
        sonic.getObjectByName(sonic_dic.Avambraccio_dx).rotation.y = - 1.5;
        sonic.getObjectByName(sonic_dic.Mano_dx).rotation.x = 5;
        sonic.getObjectByName(sonic_dic.Mano_dx).rotation.z = 0.5;

        sonic.getObjectByName(sonic_dic.Braccio_sx).rotation.z = 0;
        sonic.getObjectByName(sonic_dic.Braccio_sx).rotation.y = 1;
        sonic.getObjectByName(sonic_dic.Avambraccio_sx).rotation.z = 0;
        sonic.getObjectByName(sonic_dic.Avambraccio_sx).rotation.y = 1.5;
        sonic.getObjectByName(sonic_dic.Mano_sx).rotation.x = - 5;
        sonic.getObjectByName(sonic_dic.Mano_sx).rotation.z = 0.5;

        sonic.getObjectByName(sonic_dic.Polpaccio_dx).rotation.z = 5.5;
        sonic.getObjectByName(sonic_dic.Coscia_dx).rotation.z = 7;   
        sonic.getObjectByName(sonic_dic.Coscia_dx).rotation.y = 0.2;        
          
        sonic.getObjectByName(sonic_dic.Polpaccio_sx).rotation.z = 5.5;
        sonic.getObjectByName(sonic_dic.Coscia_sx).rotation.z = 7; 
        sonic.getObjectByName(sonic_dic.Coscia_sx).rotation.y = -0.2;    
        
        sonic.getObjectByName(sonic_dic.Testa).rotation.z = -0.2;

        clear_area();

    }
    render();
}

function clear_area(){

    for(var i = 0; i < rings.length; i++){
        rings[i].visible = false;
    }

    if(line != null) line.visible = false;
    if(fireball!=null) fireball.visible = false;
    eggman.visible = false;
    shield.visible = false;
    heart.visible = false;

    for(i = 0; i < trees.length; i++){
        if(trees[i].position.z + 6 > sonic.position.z){
            scene.remove(trees[i]);
        }
    }

    for(i = 0; i < obs.length; i++){
        if(obs[i].position.z > sonic.position.z) scene.remove(obs[i]);
    }


    text.className = 'Blazing';
    text.style.color =  'rgb(255, 115, 0)';

    var back_button = document.createElement('a');
    back_button.className = 'b';
    back_button.style.position = 'absolute';
    back_button.style.left = 30 + 'px';
    back_button.style.bottom = 30 + 'px';
    back_button.style.width = 90 + 'px';

    var button_text = document.createElement('span');
    button_text.innerHTML = 'Back';
    back_button.appendChild(button_text);

    document.body.appendChild(back_button);

    back_button.addEventListener('click', function(){
        window.location.href = "./index.html";
    });

}
