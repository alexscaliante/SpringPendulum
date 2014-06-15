"use strict";
var SpringMassSystem;

Initialize();

var SpringPendulumParams = {
    w0: 2,                              // eigen-frequency
    d : 0.1,                            // dimensionless friction constant | d > 1 means strong friction (no oscillations) and d < 1 means low friction.
    
    y0: 0,//1.2,                        // initial condition - position
    v0: 0,//-1,                         // initial condition - velocity

    u0: SpringConsts.springLength*0.4,  // amp of suspension point
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
//var selectedDynamics = sd.getInitCondFunc(SpringPendulumParams.y0,SpringPendulumParams.v0);
//var selectedDynamics = sd.getExtForceFunc(SpringPendulumParams.u0,SpringPendulumParams.we);
var selectedDynamics = sd.getPositionFunc(SpringPendulumParams.u0,SpringPendulumParams.we,SpringPendulumParams.y0,SpringPendulumParams.v0);
var mySpring = new Spring(selectedDynamics);

// init graphs
var timeDomainGraphBoard = JXG.JSXGraph.initBoard('timeDomainGraph',
                                {boundingbox:[-0.1, 10, 20, -10],
                                keepaspectratio: true,
                                axis: true,
                                pan: {
                                    needShift: false,
                                    needTwoFingers: true,
                                    enabled: true
                                },
                                showCopyright: false,
                                showNavigation: true});

var timeDomainGraph = timeDomainGraphBoard.create('functiongraph',
                                                  [selectedDynamics, 0],
                                                  {strokeColor:'blue', strokeWidth:2, needsRegularUpdate: false, highlight: false});

var timeDomainExtForceGraph = timeDomainGraphBoard.create('functiongraph',
                                                          [function(t) { return (SpringPendulumParams.u0*Math.sin(SpringPendulumParams.we*t));}, 0],
                                                          {strokeColor:'red', strokeWidth:2, needsRegularUpdate: false, highlight: false});

var timeDomainGlider = timeDomainGraphBoard.create('glider',
                                                   [timeDomainGraph],
                                                   {fixed: true, fillColor: 'blue', strokeColor: 'blue', highlight: false, withLabel: false, showInfobox: false});
var timeDomainExtForceGlider = timeDomainGraphBoard.create('glider',
                                                           [timeDomainExtForceGraph],
                                                           {fixed: true, fillColor: 'red', strokeColor: 'red', highlight: false, withLabel: false, showInfobox: false});

timeDomainGraphBoard.create('grid',[]);
timeDomainGraphBoard.zoom100();

var freqDomainGraphBoard = JXG.JSXGraph.initBoard('freqDomainGraph',
                                {boundingbox:[-0.1, 20, 10, -20],
                                keepaspectratio: false,
                                axis: true,
                                pan: {
                                    needShift: false,
                                    needTwoFingers: true,
                                    enabled: true
                                },                                  
                                showCopyright: false,
                                showNavigation: true});

var freqDomainGraph = freqDomainGraphBoard.create('functiongraph',
            [sd.getMagRespFunc(false), 0],
            {strokeColor:'blue', strokeWidth:2, highlight: false});

freqDomainGraphBoard.create('grid',[]);
freqDomainGraphBoard.zoom100();

var poleZeroGraphBoard = JXG.JSXGraph.initBoard('poleZeroGraph',
                                {boundingbox:[-3, 3, 3, -3],
                                keepaspectratio: false,
                                axis:true,
                                pan: {
                                    needShift: false,
                                    needTwoFingers: true,
                                    enabled: true
                                },
                                showCopyright: false,
                                showNavigation: true});

var poleZeroGraphCenter = poleZeroGraphBoard.create('point',
            [0,0],
            {visible: false});

poleZeroGraphBoard.create('grid',[]);

var poleZeroCircle = poleZeroGraphBoard.create('circle',
            [poleZeroGraphCenter,1],
            {highlight: false, dash: 1});

var poles = sd.getPoles();
var poleZeroPole1 = poleZeroGraphBoard.create('point',
            [poles[0]],
            {fixed: true, face: "cross", name: "1"});
var poleZeroPole2 = poleZeroGraphBoard.create('point',
            [poles[1]],
            {fixed: true, face: "cross", name: "2"});

// TODO: this is somehow happening before the whole graph is loaded, FIXME
poleZeroGraphBoard.zoomElements([poleZeroCircle,poleZeroPole1, poleZeroPole2]);
poleZeroGraphBoard.moveOrigin(poleZeroGraphBoard.containerObj.clientWidth / 2, poleZeroGraphBoard.containerObj.clientHeight / 2);
    
function updateSpringDynamics() {    
    timeDomainGraph.Y = selectedDynamics;
    mySpring.updateDynamics(selectedDynamics);
    timeDomainGraph.updateCurve();
    timeDomainGraphBoard.update();

    freqDomainGraph.Y = sd.getMagRespFunc(false);
    freqDomainGraph.updateCurve();
    freqDomainGraphBoard.update();
    
    poles = sd.getPoles();
    poleZeroPole1.setPosition(JXG.COORDS_BY_USER , poles[0]);
    poleZeroPole2.setPosition(JXG.COORDS_BY_USER , poles[1]);
    poleZeroGraphBoard.update();
    poleZeroGraphBoard.zoomElements([poleZeroCircle,poleZeroPole1, poleZeroPole2]);    
    poleZeroGraphBoard.moveOrigin(poleZeroGraphBoard.origin.scrCoords[1], poleZeroGraphBoard.canvasHeight / 2);

    staticRendered = false;
}

var prevtime = 0;
function render(t) {
    
    requestAnimationFrame(render);
    
    if (t === undefined) {
        t = 0;
    }
    
    t = t / 1000;
    var delta = (t - prevtime);   // time step 
    prevtime = t;
    
    controls.update(delta);
    
    //document.getElementById("debug").innerHTML = "";
    
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

        var ut = (SpringPendulumParams.u0 * Math.sin(SpringPendulumParams.we * t ) );
        
        ceilingMesh.position.set(0,(SpringPendulumConsts.offsetCeiling+ut),0);
        
        var springSize = drawSpring(ut, t);
        
        mirrorSphere.visible = false;
        mirrorSphereCamera.updateCubeMap( renderer, scene );
        mirrorSphere.visible = true;
        mirrorSphere.position.set(0,(SpringPendulumConsts.offsetCeiling + springSize + ut - SpringPendulumConsts.ballRadius)/*(SpringConsts.springLength + (1+selectedDynamics(t/1000)) ) - 10)*/,0);
                
        timeDomainGlider.setGliderPosition(Math.round(t*1000)/1000);
        timeDomainExtForceGlider.setGliderPosition(Math.round(t*1000)/1000);
        //if((t) > 10)
        //    timeDomainGraphBoard.moveOrigin(timeDomainGraphBoard.origin.scrCoords[1] - (timeDomainGraphBoard.unitX * delta), timeDomainGraphBoard.canvasHeight / 2);
                
        //document.getElementById("debug").innerHTML = ""+selectedDynamics(t/1000)+"<br>render";
    }
    
    renderer.render( scene, camera );
}

render();