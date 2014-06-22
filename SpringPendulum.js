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

// init graphs
var timeDomainGraphBoard = JXG.JSXGraph.initBoard('timeDomainGraph',
                                {boundingbox:[-0.1, 10, 20, -10],
                                keepaspectratio: false,
                                axis: true,
                                grid: true,
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

//var timeDomainGlider = timeDomainGraphBoard.create('glider',
//                                                   [timeDomainGraph],
//                                                   {fixed: true, fillColor: 'blue', strokeColor: 'blue', highlight: false, withLabel: false, showInfobox: false});
var timeDomainGlider = timeDomainGraphBoard.create('point',
                                                   [0,selectedDynamics(0)],
                                                   {fixed: true,
                                                   fillColor: 'blue',
                                                   strokeColor: 'blue',
                                                   highlight: false,
                                                   withLabel: false,
                                                   showInfobox: false});
//var timeDomainExtForceGlider = timeDomainGraphBoard.create('glider',
//                                                           [timeDomainExtForceGraph],
//                                                           {fixed: true, fillColor: 'red', strokeColor: 'red', highlight: false, withLabel: false, showInfobox: false});
var timeDomainExtForceGlider = timeDomainGraphBoard.create('point',
                                                           [0,0],
                                                           {fixed: true,
                                                           fillColor: 'red',
                                                           strokeColor: 'red',
                                                           highlight: false,
                                                           withLabel: false,
                                                           showInfobox: false});

timeDomainGraphBoard.zoom100();

var freqDomainMagGraphBoard = JXG.JSXGraph.initBoard('freqDomainMagGraph',
                                {boundingbox:[-0.1, 10, 10, -10],
                                keepaspectratio: false,
                                axis: true,
                                grid: true,
                                pan: {
                                    needShift: false,
                                    needTwoFingers: true,
                                    enabled: true
                                },
                                showCopyright: false,
                                showNavigation: true});

var freqDomainMagGraph = freqDomainMagGraphBoard.create('functiongraph',
            [sd.getMagRespFunc(false), 0],
            {strokeColor:'blue', strokeWidth:2, highlight: false});

freqDomainMagGraphBoard.zoom100();

var freqDomainMagDbGraphBoard = JXG.JSXGraph.initBoard('freqDomainMagDbGraph',
                                {boundingbox:[-2, 50, 2, -50],
                                keepaspectratio: false,
                                //axis: true,
                                //grid: true,
                                pan: {
                                    needShift: false,
                                    needTwoFingers: true,
                                    enabled: true
                                },
                                showCopyright: false,
                                showNavigation: true});

var xAxis = freqDomainMagDbGraphBoard.create('axis', [[0,0],[1,0]],
                                             {
                                                ticks:
                                                {
                                                    insertTicks: false,
                                                    minorTicks: 0
                                                }
                                             });

// copy from the JXGGraph source
xAxis.defaultTicks.generateLabelText = function(tick, zero, value) {
    var Mat = JXG.Math;
    var Type = JXG;
    
    var labelText,
        distance = this.getDistanceFromZero(zero, tick);

    if (Math.abs(distance) < Mat.eps) { // Point is zero
        labelText = '0';
    } else {
        // No value provided, equidistant, so assign distance as value
        if (!Type.exists(value)) { // could be null or undefined
            value = distance / this.visProp.scale;
        }

        labelText = value.toString();

        // if value is Number
        if (Type.isNumber(value)) {
            if (labelText.length > this.visProp.maxlabellength || labelText.indexOf('e') !== -1) {
                labelText = value.toPrecision(this.visProp.precision).toString();
            }
            if (labelText.indexOf('.') > -1 && labelText.indexOf('e') === -1) {
                // trim trailing zeros
                labelText = labelText.replace(/0+$/, '');
                // trim trailing .
                labelText = labelText.replace(/\.$/, '');
            }
        }
                
        if (this.visProp.scalesymbol.length > 0) {
            if (labelText === '1') {
                labelText = this.visProp.scalesymbol;
            } else if (labelText === '-1') {
                labelText = '-' + this.visProp.scalesymbol;
            } else if (labelText !== '0') {
                labelText = labelText + this.visProp.scalesymbol;
            }
        }
        
        // add log scale
        labelText = '10<sup>'+ labelText + '</sup>';
    }

    return labelText;    
}

// create log ticks
for(var i=2; i<10; i++)
{
    var line = freqDomainMagDbGraphBoard.create('line',[[Math.LOG10E*Math.log(i), 0],[2,0]],{visible: false});
    var tick = freqDomainMagDbGraphBoard.create('ticks', [line,1],
                                                {insertTicks: false,
                                                minorTicks: 0,
                                                drawZero: true,
                                                strokeColor: '#666666',
                                                strokeOpacity: 0.125,
                                                majorHeight: -1,
                                                fixed: true,
                                                highlight: false});
}

var yAxis = freqDomainMagDbGraphBoard.create('axis', [[0,0],[0,1]],
                                             {ticks: {
                                                label: {
                                                    anchorX: 'right',
                                                    offset: [20,0]
                                                },
                                                insertTicks: false,
                                                ticksDistance: 10,
                                                minorTicks: 1
                                             }});
freqDomainMagDbGraphBoard.fullUpdate();

var freqDomainMagDbGraph = freqDomainMagDbGraphBoard.create('curve',
                       [function(t){ return Math.LOG10E*Math.log(t);},
                        sd.getMagRespFunc(true),
                        -100,100],{strokeColor:'blue', strokeWidth:2, highlight: false});

freqDomainMagDbGraphBoard.zoom100();
$("#freqDomainMagDbGraph").hide();

var freqDomainPhaseGraphBoard = JXG.JSXGraph.initBoard('freqDomainPhaseGraph',
                                {boundingbox:[-10, 40, 100, -220],
                                keepaspectratio: false,
                                axis: true,
                                grid: false,
                                pan: {
                                    needShift: false,
                                    needTwoFingers: true,
                                    enabled: true
                                },
                                showCopyright: false,
                                showNavigation: true});

var freqDomainPhaseGraph = freqDomainPhaseGraphBoard.create('functiongraph',
            [sd.getPhaseRespFunc(), 0],
            {strokeColor:'blue', strokeWidth:2, highlight: false});

freqDomainMagGraphBoard.zoom100();
$("#freqDomainPhaseGraph").hide();

var poleZeroGraphBoard = JXG.JSXGraph.initBoard('poleZeroGraph',
                                {boundingbox:[-3, 3, 3, -3],
                                keepaspectratio: false,
                                axis: false,
                                pan: {
                                    needShift: false,
                                    needTwoFingers: true,
                                    enabled: true
                                },
                                showCopyright: false,
                                showNavigation: true});

poleZeroGraphBoard.create('axis', [[0,0],[1,0]], {ticks: { minorTicks: 0, minTicksDistance: 18, insertTicks: true, ticksDistance: 1}});
poleZeroGraphBoard.create('axis', [[0,0],[0,1]], {ticks: { minorTicks: 0, minTicksDistance: 18, insertTicks: true, ticksDistance: 1}});

var poleZeroGraphCenter = poleZeroGraphBoard.create('point',
            [0,0],
            {visible: false});

var poleZeroCircle = poleZeroGraphBoard.create('circle',
            [poleZeroGraphCenter,1],
            {fixed: true, highlight: false, dash: 1});

var poles = sd.getPoles();
var poleZeroPole1 = poleZeroGraphBoard.create('point',
            [poles[0]],
            {fixed: true, face: "cross", label: {strokeColor: "red"}, name: "1"});
var poleZeroPole2 = poleZeroGraphBoard.create('point',
            [poles[1]],
            {fixed: true, face: "cross", label: {strokeColor: "red"}, name: "2"});

// TODO: this is somehow happening before the whole graph is loaded, FIXME
poleZeroGraphBoard.zoomElements([poleZeroCircle,poleZeroPole1, poleZeroPole2]);
poleZeroGraphBoard.moveOrigin(poleZeroGraphBoard.containerObj.clientWidth / 2, poleZeroGraphBoard.containerObj.clientHeight / 2);
    
function updateSpringDynamics() {    
    timeDomainGraph.Y = selectedDynamics;
    mySpring.updateDynamics(selectedDynamics);
    timeDomainGraph.updateCurve();
    //timeDomainGlider.setGliderPosition(0);
    //timeDomainExtForceGlider.setGliderPosition(0);
    timeDomainGlider.setPosition(JXG.COORDS_BY_USER,[0,selectedDynamics(0)]);
    timeDomainExtForceGlider.setPosition(JXG.COORDS_BY_USER,[0,0]);    
    timeDomainGraphBoard.fullUpdate();

    if($(freqDomainMagGraphBoard.containerObj).is(":hidden") == false)
    {
        freqDomainMagGraph.Y = sd.getMagRespFunc(false);
        freqDomainMagGraph.updateCurve();
        freqDomainMagGraphBoard.update();
    }
    else if($(freqDomainMagDbGraphBoard.containerObj).is(":hidden") == false)
    {
        freqDomainMagDbGraph.Y = sd.getMagRespFunc(true);
        freqDomainMagDbGraph.updateCurve();
        freqDomainMagDbGraphBoard.update();    
    }
    else if($(freqDomainPhaseGraphBoard.containerObj).is(":hidden") == false)
    {
        freqDomainPhaseGraph.Y = sd.getPhaseRespFunc();
        freqDomainPhaseGraph.updateCurve();
        freqDomainPhaseGraphBoard.update();
    }
    
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
        
        if ((springSize+(SpringPendulumConsts.ceilingZ/2))>=0) { // look for the ponit where the mass hits the ceiling
            $("#dialog-message").puidialog("show"); // display a warning text
            $("#button-stop").click(); // handel this event as the Stop button was pushed
        }
        
        mirrorSphere.visible = false;
        mirrorSphereCamera.updateCubeMap( renderer, scene );
        mirrorSphere.visible = true;
        mirrorSphere.position.set(0,(SpringPendulumConsts.offsetCeiling + springSize + ut - SpringPendulumConsts.ballRadius)/*(SpringConsts.springLength + (1+selectedDynamics(t/1000)) ) - 10)*/,0);
        
        if(timeDomainFollow == true)
        {
            var trunkTime = Math.round(t*100)/100;
            timeDomainGlider.setPosition(JXG.COORDS_BY_USER,[trunkTime,selectedDynamics(trunkTime)]);
            timeDomainExtForceGlider.setPosition(JXG.COORDS_BY_USER,[trunkTime,ut]);
            timeDomainGraphBoard.update();
            //timeDomainGlider.setGliderPosition(trunkTime);
            //timeDomainExtForceGlider.setGliderPosition(trunkTime);
            //if((t) > 10)
            timeDomainGraphBoard.moveOrigin(timeDomainGraphBoard.containerObj.clientWidth/2 - (timeDomainGraphBoard.unitX * t), timeDomainGraphBoard.canvasHeight / 2)
                //timeDomainGraphBoard.moveOrigin(timeDomainGraphBoard.origin.scrCoords[1] - (timeDomainGraphBoard.unitX * delta), timeDomainGraphBoard.canvasHeight / 2);
        }        
        //document.getElementById("debug").innerHTML = ""+selectedDynamics(t/1000)+"<br>render";
    }
    
    renderer.render( scene, camera );
}

render();
