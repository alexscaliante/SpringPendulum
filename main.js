"use strict";
var SpringMassSystem;
Initialize();

var m = 10;
var w0 = Math.sqrt(10/m);
var d = 0.1;
var sd = new SpringDynamics(m, w0, d);
var x0 = 0.5;
var v0 = -1;

function render(t) {
    
    requestAnimationFrame(render);
    if (t === undefined) {
        t = 0;
    }
    var delta = (t - prevtime)/1000;   // time step 
    var prevtime = t;
    
    //mcc.updateDist();
    //mcc.updateRot();
    controls.update(delta);
    //camera.lookAt(new THREE.Vector3(0,-50,0));
    
    var f = document.getElementById("FreqVal").value;
    var m = document.getElementById("MassVal").value;
    var k = document.getElementById("StiffVal").value; // spring-constant 
    
    CheckLanguage();
    
    //var omega = Math.sqrt(k/m);
    //if (m == 0) 
    //   omega = 0;
    
    SpringMassSystem = sd.getInitCondFunc(x0,v0)(t/500);//Math.abs(Math.cos(omega*t/1000));
    
    mirrorSphere.visible = false;
    mirrorSphereCamera.updateCubeMap( renderer, scene );
    mirrorSphere.visible = true;
    
    mirrorSphere.position.set(0,yFunc*5+offsetYdirToPlane+offsetYdirToCoil+radiusSegments+ceilingZ,0);

    drawCoil();
    renderer.render( scene, camera );
}
render();
function CheckLanguage() {
    
    if(document.getElementById('RadioEngButton').checked) {
        document.getElementById("EngLang").innerHTML = "English";
        document.getElementById("GerLang").innerHTML = "German";
        document.getElementById("freq").innerHTML = "Frequency";
        document.getElementById("mass").innerHTML = "Mass";
        document.getElementById("stiff").innerHTML = "Stiffness";
    }
    else if(document.getElementById('RadioGerButton').checked) {
        document.getElementById("EngLang").innerHTML = "Englisch";
        document.getElementById("GerLang").innerHTML = "Deutsch";
        document.getElementById("freq").innerHTML = "Frequenz";
        document.getElementById("mass").innerHTML = "Masse";
        document.getElementById("stiff").innerHTML = "Steifheit";
    }
    
    
}