"use strict";
var SpringMassSystem;

Initialize();

var k = 1; // spring constant
var m = 1; // mass
var y0 = 1.2; // initial condition - position
var v0 = -1; // initial condition - velocity
var w0 = Math.sqrt(k/m); // eigen-frequency
//var w0 = 2;
var d = 1; // dimensionless friction constant | d > 1 means strong friction (no oscillations) and d < 1 means low friction.
var sd = new SpringDynamics(w0, d);
var u0 = 2; // amp of suspension point
var we = 10; // external frequency
//var selectedDynamics = sd.getInitCondFunc(y0,v0);
var selectedDynamics = sd.getExtForceFunc(u0,we);
var mySpring = new Spring(selectedDynamics);

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
    var ut = -(u0*Math.sin(we*t/1000))
    //SpringMassSystem = sd.getInitCondFunc(x0,v0)(t/500);//Math.abs(Math.cos(omega*t/1000));///
    
    ceilingMesh.position.set(0,SpringPendulumConsts.offsetCeiling+ut,0);
    
    drawSpring(ut, t);
    
    mirrorSphere.visible = false;
    mirrorSphereCamera.updateCubeMap( renderer, scene );
    mirrorSphere.visible = true;
    
    mirrorSphere.position.set(0,SpringPendulumConsts.offsetCeiling+(SpringConsts.springLength*5*(1+selectedDynamics(t/1000)))+12,0);
    
    document.getElementById("debug").innerHTML = ""+(SpringConsts.springLength*5*(1+selectedDynamics(t/1000)));
    
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