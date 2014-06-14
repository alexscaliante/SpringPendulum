"use strict";
var SpringMassSystem;

Initialize();

var SpringPendulumParams = {
    w0: 1.9,                            // eigen-frequency
    d : 0.1,                            // dimensionless friction constant | d > 1 means strong friction (no oscillations) and d < 1 means low friction.
    
    y0: 0,//1.2,                        // initial condition - position
    v0: 0,//-1,                         // initial condition - velocity

    u0: 5,  // amp of suspension point
    we: 3                               // external frequency
};

SpringPendulumParams.changeParam = function(param, value) {
    if(this[param] !== undefined)
        this[param] = value;
    else
        return false;
    
    if (param == "d" || param == "w0") {
        sd = new SpringDynamics(SpringPendulumParams.w0, SpringPendulumParams.d);
    }
    
    selectedDynamics = sd.getPositionFunc(SpringPendulumParams.u0,SpringPendulumParams.we,SpringPendulumParams.y0,SpringPendulumParams.v0);

    return true;
}

var sd = new SpringDynamics(SpringPendulumParams.w0, SpringPendulumParams.d);
var selectedDynamics = sd.getPositionFunc(SpringPendulumParams.u0,SpringPendulumParams.we,SpringPendulumParams.y0,SpringPendulumParams.v0);
var mySpring = new Spring(selectedDynamics);

var responseGraphBoard = JXG.JSXGraph.initBoard('responseGraph',
                                  {boundingbox:[-0.1, 10, 20, -10],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: true});

var responseGraph = responseGraphBoard.create('functiongraph',
            [selectedDynamics],
            {strokeColor:'blue', strokeWidth:2});

responseGraphBoard.create('functiongraph',
            [function(t) { return (SpringPendulumParams.u0*Math.sin(SpringPendulumParams.we*t));}],
            {strokeColor:'red', strokeWidth:2});

responseGraphBoard.zoom100();

function updateSpringDynamics() {    
    /*w0 = $("#eigenfrequency").val();    // eigen-frequency
    d =  $("#damping").val();           // damping
    sd = new SpringDynamics(w0, d);
    u0 =  $("#extforce-amp").val();     // amp of external force
    we = $("#extforce-freq").val();     // external frequency
    selectedDynamics = sd.getExtForceFunc(u0,we);*/
    responseGraph.Y = selectedDynamics;
    mySpring.updateDynamics(selectedDynamics);
    responseGraph.updateCurve();
    responseGraphBoard.update();
    staticRendered = false;
}

function render(t) {
    
    requestAnimationFrame(render);
    if (t === undefined) {
        t = 0;
    }
    var delta = (t - prevtime)/1000;   // time step 
    var prevtime = t;
    controls.update(delta);
    document.getElementById("debug").innerHTML = "";
    
    if(runningFlag == true || staticRendered == false)
    {        
        if(runningFlag == false && staticRendered == false)
        {
            t = 0;
            staticRendered = true;
        } else {
            if (startTime == undefined) {
                startTime = t;
            }
            t = t - startTime;            
        }

        var ut = (SpringPendulumParams.u0 * Math.sin(SpringPendulumParams.we * (t/1000) ) );
        
        ceilingMesh.position.set(0,(SpringPendulumConsts.offsetCeiling+ut),0);
        
        var springSize = drawSpring(ut, t);
        
        if ((springSize+(SpringPendulumConsts.ceilingZ/2))>=0) { // look for the ponit where the mass hits the ceiling
            $("#dialog-message").dialog("open");// display a warning text        
            $("#button-stop").click();// handel this event as the Stop button was pushed
        }
        
        mirrorSphere.visible = false;
        mirrorSphereCamera.updateCubeMap( renderer, scene );
        mirrorSphere.visible = true;
        mirrorSphere.position.set(0,(SpringPendulumConsts.offsetCeiling + springSize + ut - SpringPendulumConsts.ballRadius),0);
    }
    
    renderer.render( scene, camera );
}

render();