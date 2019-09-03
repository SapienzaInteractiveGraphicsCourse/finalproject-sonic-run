var tails;
var spawn_tails = true;
var can_move_tails = false;

const tails_dic = { 

    Testa : "Head_08",
  
    Coscia_dx : "Thigh_R_058",
    Polpaccio_dx : "Calf_R_059",
  
    Coscia_sx : "Thigh_L_052",
    Polpaccio_sx : "Calf_L_053",
  
    Braccio_dx : "UpperArm_R_028",
    Avambraccio_dx : "ForeArm_R_029",
  
    Braccio_sx : "UpperArm_L_011",
    Avambraccio_sx : "ForeArm_L_012",
  };

var tails_run = [lerp(4, 2 , run_speed).concat(lerp(2, 4, run_speed)), lerp(0, -0.5, run_speed).concat(lerp(-0.5,0,run_speed)), 
    lerp(2, 4, run_speed).concat(lerp(4, 2,run_speed)),lerp(-0.5, 0, run_speed).concat(lerp(0,-0.5,run_speed)),
    lerp(0, -2, run_speed).concat(lerp(-2,0,run_speed)),lerp(-2, 0, run_speed).concat(lerp(0,-2,run_speed)),
    lerp(0, 1, run_speed).concat(lerp(1,0,run_speed)),lerp(1, 0, run_speed).concat(lerp(0,1,run_speed))];
  
var tails_jump_points = lerp(0 , 1.5 , 0.04).concat(lerp(1.5 , 0 , 0.04));

var can_jump = false;
var jumping = false;
var t_tails_jump = 0;

function tails_jump(){
    for(var i = 0; i < obs.length; i++){
        if(obs[i].rotation.z != 80.1) continue;
        var z1 = tails.position.z <= obs[i].position.z + 2; 
        var z2 = tails.position.z >= obs[i].position.z - 2;
        var x1 = tails.position.x >= obs[i].position.x - error*2.5;
        var x2 = tails.position.x <= obs[i].position.x + error*2.5;
        if(z1 && z2 && x1 && x2) return true;
    }
    return false;
}

var mr = false, ml = false; 

function move_aside(){
    var move = false;
    for(var i = 0; i < obs.length; i++){
        if(obs[i].rotation.z == 80.1) continue;
        var z1 = tails.position.z <= obs[i].position.z + 2; 
        var z2 = tails.position.z >= obs[i].position.z - 2;
        var x1 = tails.position.x >= obs[i].position.x - 0.5;
        var x2 = tails.position.x <= obs[i].position.x + 0.5;
        if(z1 && z2 && x1 && x2){
            move = true;
            break;
        }
    }

    if(move){
        var side = tails.position.x > 0 ? 1 : -1;
        var right = tails.position.x > -2 ? true : false;
        var left = tails.position.x < 2 ? true : false;
        if((side == 1 && left) || (side == -1 && !right) || ml ){ 
            tails.position.x += 0.25;
            ml = true;
        } else if((side == 1 && !left) || (side == -1 && right) || mr){
            tails.position.x -= 0.25;
            mr = true;
        }  
    } else {
        mr = false;
        ml = false;
    }
}

function move_tails(t){

    if(tails.position.z + 3 < sonic.position.z){
        can_move_tails = false;
        spawn_tails = true;
        return;
    } 

    tails.getObjectByName(tails_dic.Polpaccio_dx).rotation.z = tails_run[1][t];
    tails.getObjectByName(tails_dic.Coscia_dx).rotation.z = tails_run[0][t];
    tails.getObjectByName(tails_dic.Polpaccio_sx).rotation.z = tails_run[3][t];
    tails.getObjectByName(tails_dic.Coscia_sx).rotation.z = tails_run[2][t];
    tails.getObjectByName(tails_dic.Avambraccio_sx).rotation.z = tails_run[4][t];
    tails.getObjectByName(tails_dic.Avambraccio_dx).rotation.z = tails_run[5][t];
    tails.getObjectByName(tails_dic.Braccio_dx).rotation.z = tails_run[6][t];
    tails.getObjectByName(tails_dic.Braccio_sx).rotation.z = tails_run[7][t];
    tails.position.z -= s;
    

    if(!can_jump) jumping = tails_jump();
    if(jumping){
        tails.position.y = tails_jump_points[t_tails_jump];
        t_tails_jump += 1;
        can_jump = true;
        if(t_tails_jump >= tails_jump_points.length){
            t_tails_jump = 0;
            can_jump = false;
        }
    } else move_aside();

    if(!invincibility){
        check_tails();
    }
} 

function check_tails(){
    var x1 = sonic.position.x <= tails.position.x + error;
    var x2 = sonic.position.x >= tails.position.x - error;
    var z1 = sonic.position.z >= tails.position.z - error;
    var z2 = sonic.position.z <= tails.position.z + error;
    if(x1 && x2 && z1 && z2){
        getDamage();
        damage_feedback();
    }
}

function spawnTails(){
    if(Math.random() > items_probability){
        var side = Math.random() > 0.5 ? -1 : 1;
        tails.position.set(side*Math.random()*3, 0, sonic.position.z + 100);
        can_move_tails = true;
        spawn_tails = false;   
    } 
}
