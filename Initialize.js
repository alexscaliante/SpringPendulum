"use strict";

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
/* Global Variables */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

// standard global variables
var scene,camera,renderer;
// custom global variables
var controls,springMesh,xFunc,yFunc,zFunc,SpringCon,mirrorSphere,mirrorSphereCamera,ceilingMesh,runningFlag,startTime,staticRendered,timeDomainFollow;

var SpringPendulumConsts = {
    ballRadius: 10,
    ceilingX: 20,
    ceilingY: 40,
    ceilingZ: 5,
    poleX: 10,
    poleY: 10,
    poleZ: 90,
    offsetPlane: 33
}

SpringPendulumConsts.offsetCeiling = SpringPendulumConsts.offsetPlane + SpringPendulumConsts.poleZ*0.8; // set the ceiling strat position 80% of the pole length
SpringPendulumConsts.offsetPole = SpringPendulumConsts.offsetPlane + SpringPendulumConsts.poleZ/2;

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
/* Setup scene, GUI, light and camera controller */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

function Initialize()
{
    runningFlag = true; // start the animation when page get loaded
    timeDomainFollow = false;
    
    var canvas = document.getElementById("mycanvas");
   
    renderer = new THREE.WebGLRenderer({canvas:canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor('rgb(0,0,0)');  // black background

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
    scene.fog.color.setHSL( 0.6, 0, 1 );

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 10000 );
    camera.position.set( -100, 125, -100);
    
    controls = new THREE.OrbitControls( camera, canvas );    
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.minDistance = 100;
    controls.maxDistance = 400;
    controls.staticMoving = false;
    controls.keys = [ 65, 83, 68 ];
    controls.target.set(0, 80, 0);   
    
    // Ground plane
    var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( {ambient: 0x999999, color: 0x999999, specular: 0x101010, side: THREE.DoubleSide } )    
    groundMat.color.setHSL( 0.095, 1, 0.75 );
    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.rotation.x = Math.PI/2;
    ground.position.y = SpringPendulumConsts.offsetPlane;
    scene.add( ground );
    ground.receiveShadow = true;
    
    // Skydome
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, -500, 0 );
    scene.add( hemiLight );
    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
            topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
            bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
            offset:		 { type: "f", value: 33 },
            exponent:	 { type: "f", value: 0.6 }
    }
    uniforms.topColor.value.copy( hemiLight.color );
    scene.fog.color.copy( uniforms.bottomColor.value );
    var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );
    
    // Pole for the spring to atch on
    var ceilingGeometry = new THREE.CubeGeometry( SpringPendulumConsts.ceilingX, SpringPendulumConsts.ceilingY, SpringPendulumConsts.ceilingZ );
    var poleGeometry = new THREE.CubeGeometry( SpringPendulumConsts.poleX, SpringPendulumConsts.poleY, SpringPendulumConsts.poleZ );
    var cubeMaterial = new THREE.MeshPhongMaterial( { shininess: 20, ambient: 0x555555, color: 0xffffff, specular: 0x111111} );
    ceilingMesh = new THREE.Mesh( ceilingGeometry, cubeMaterial );
    var poleMesh = new THREE.Mesh( poleGeometry, cubeMaterial );
    ceilingMesh.rotation.x = Math.PI/2;
    ceilingMesh.rotation.z = Math.PI/2;
    poleMesh.rotation.x = Math.PI/2;
    ceilingMesh.position.set(0,SpringPendulumConsts.offsetCeiling,0);
    poleMesh.position.set(20,SpringPendulumConsts.offsetPole,0);
    scene.add(poleMesh);
    scene.add(ceilingMesh);

    // Lighting
    scene.add(new THREE.AmbientLight(0x999999));
    
    // Chrome mass object
    var sphereGeom =  new THREE.SphereGeometry( SpringPendulumConsts.ballRadius, 100, 100 ); // radius, segmentsWidth, segmentsHeight
    mirrorSphereCamera = new THREE.CubeCamera( 0.01, 10000, 112 );
    scene.add( mirrorSphereCamera );
    var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
    mirrorSphere = new THREE.Mesh( sphereGeom, mirrorSphereMaterial );
    mirrorSphere.position.set(0,SpringPendulumConsts.offsetCeiling+SpringPendulumConsts.springLength,0); // natural position without taking into account the mass
    mirrorSphereCamera.position = mirrorSphere.position;
    mirrorSphere.castShadow = true;
    mirrorSphere.receiveShadow = true;
    scene.add(mirrorSphere);
    
    /*
    // Simple mass object, if better performance is required
    var sphereGeom =  new THREE.SphereGeometry( SpringPendulumConsts.ballRadius, 100, 100 ); // radius, segmentsWidth, segmentsHeight
    var SphereMaterial = new THREE.MeshBasicMaterial({color: 'black'});
    mirrorSphere = new THREE.Mesh( sphereGeom, SphereMaterial );
    mirrorSphere.position.set(0,SpringPendulumConsts.offsetCeiling+SpringPendulumConsts.springLength,0); // natural position without taking into account the mass
    mirrorSphere.castShadow = true;
    mirrorSphere.receiveShadow = true;
    scene.add(mirrorSphere);
    */
}
