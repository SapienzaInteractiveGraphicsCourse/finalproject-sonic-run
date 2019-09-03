var sonic;
var jump = false;
var s = 0.1;
var run_speed = 0.03;
var error = 0.5;
var invincibility = false;

const sonic_dic = { 

    Testa : "Head_06",
  
    Coscia_dx : "Thigh_R_014",
    Polpaccio_dx : "Calf_R_015",
  
    Coscia_sx : "Thigh_L_09",
    Polpaccio_sx : "Calf_L_010",
  
    Braccio_dx : "UpperArm_R_035",
    Avambraccio_dx : "ForeArm_R_036",
    Mano_dx : "Hand_R_037",
  
    Indice_lower_sx: "Index2_L_024",
    Indice_upper_sx: "Index1_L_023",
    Medio_lower_sx: "Middle2_L_026",
    Medio_upper_sx: "Middle1_L_025",
    Mignolo_lower_sx:  "Pinky2_L_028",
    Mignolo_upper_sx: "Pinky1_L_027",    
    Anulare_lower_sx: "Ring2_L_030",
    Anulare_upper_sx:  "Ring1_L_029",
    Pollice_lower_sx: "Thumb2_L_032",
    Pollice_upper_sx:  "Thumb1_L_031",
    Indice_upper_dx: "Index1_R_038",
    Indice_lower_dx: "Index2_R_039",
    Medio_upper_dx: "Middle1_R_040",
    Medio_lower_dx: "Middle2_R_041",
    Mignolo_upper_dx: "Pinky1_R_042",
    Mignolo_lower_dx: "Pinky2_R_043",
    Anulare_upper_dx: "Ring1_R_044",
    Anulare_lower_dx: "Ring2_R_045",
    Pollice_upper_dx: "Thumb1_R_046",
    Pollice_lower_dx: "Thumb2_R_047",
  
    Braccio_sx : "UpperArm_L_020",
    Avambraccio_sx : "ForeArm_L_021",
    Mano_sx : "Hand_L_022",
  };
  
var run = [lerp(6, 8 , run_speed).concat(lerp(8, 6, run_speed)), lerp(4, 5.5, run_speed).concat(lerp(5.5,4,run_speed)), 
    lerp(8, 6, run_speed).concat(lerp(6,8,run_speed)),lerp(5.5 , 4, run_speed).concat(lerp(4,5.5,run_speed)),
    lerp(0, -2, run_speed).concat(lerp(-2,0,run_speed)),lerp(-2, 0, run_speed).concat(lerp(0,-2,run_speed)),
    lerp(0, 1, run_speed).concat(lerp(1,0,run_speed)),lerp(1, 0, run_speed).concat(lerp(0,1,run_speed))];
  
var jump_points = lerp(0 , 1.5 , 0.04).concat(lerp(1.5 , 0 , 0.04));

function move_sonic(){
    sonic.getObjectByName(sonic_dic.Polpaccio_dx).rotation.z = run[1][t];
    sonic.getObjectByName(sonic_dic.Coscia_dx).rotation.z = run[0][t];
      
    sonic.getObjectByName(sonic_dic.Polpaccio_sx).rotation.z = run[3][t];
    sonic.getObjectByName(sonic_dic.Coscia_sx).rotation.z = run[2][t];

    sonic.getObjectByName(sonic_dic.Avambraccio_sx).rotation.z = run[4][t];
    sonic.getObjectByName(sonic_dic.Avambraccio_dx).rotation.z = run[5][t];
    sonic.getObjectByName(sonic_dic.Braccio_dx).rotation.z = run[6][t];
    sonic.getObjectByName(sonic_dic.Braccio_sx).rotation.z = run[7][t];

    if(jump){
        sonic.position.y = jump_points[t_jump];
        t_jump += 1;
        if(t_jump >= jump_points.length){
          jump = false;
          t_jump = 0;
        }
    } 
}