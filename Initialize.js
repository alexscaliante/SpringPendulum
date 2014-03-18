"use strict";
/* Global Variables */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// standard global variables
var scene,camera,renderer;
// custom global variables
var controls,mcc,scaleFactor,coilMesh,xFunc,yFunc,zFunc,CoilCon,mirrorSphere,mirrorSphereCamera;
var springLength = 4; // natural length of coil
var windingFactor = 40;
var segments = 500;
var radiusSegments = 6;
var tubeRadius = 0.5;
var offset = 60; // move in y direction 
// ceiling dimentions
var ceilingX = 20;
var ceilingY = 40;
var ceilingZ = 5;

var offsetYdirToPlane = -33;
var offsetYdirToCoil = -60;
var offsetYdir;

// coil shape
var Coil = /*new*/ THREE.Curve.create(
    function() {},
    function(u) 
    {   // basis Helix shape
        xFunc = Math.cos(u*windingFactor);
        zFunc = Math.sin(u*windingFactor);
        yFunc = springLength*u*(1+SpringMassSystem);
        return new THREE.Vector3(xFunc, yFunc, zFunc).multiplyScalar(5);// the scalar simply increses the diameter of the coil
    }
);
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

/* Setup scene, GUI, light and camera controller */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
function Initialize(){
    document.getElementById('RadioEngButton').checked = true; // set english as defulte 
    
    var canvas = document.getElementById("mycanvas");
    renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor('rgb(0,0,0)');  // black background
    // Create a new Three.js scene and a camera
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
    scene.fog.color.setHSL( 0.6, 0, 1 );
    
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 10000 );
    
    camera.position.set( -100, -150, 100);
    
    camera.up.set(0,-1,0);
            
    camera.lookAt(new THREE.Vector3(0,-50,0));
    
    controls = new THREE.TrackballControls( camera, canvas );
    //controls = new THREE.OrbitControls( camera );
    
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 2;
    controls.panSpeed = 0.8;
    
    controls.noZoom = false;
    controls.noPan = false;
    
    controls.minDistance = 100;
    controls.maxDistance = 400;
    
    controls.staticMoving = false;
    //controls.dynamicDampingFactor = 0.3;
    
    controls.keys = [ 65, 83, 68 ];
    
    //controls.addEventListener( 'change', render );
				
    //mcc = new MouseCamController(camera, canvas);

    // Help plane 
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0,side: THREE.DoubleSide } ) );
    plane.position.set(0,0,0);
    plane.overdraw = true;
    //scene.add( plane );    

    var CoilController = function() {
        this.Frequency = 0;
        this.Mass = 2;
        this.Stiffness = 7;
    };
    /*
    CoilCon = new CoilController();

    window.onload = function() {
        var gui = new dat.GUI();
        var CoilFolder = gui.addFolder('Coil Parameters');
        CoilFolder.add(CoilCon, 'Frequency',0,100);
        CoilFolder.add(CoilCon, 'Mass',0,1000);
        CoilFolder.add(CoilCon, 'Stiffness',1,100);
    }
    */
    // Ground plane
    var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( {ambient: 0x999999, color: 0x999999, specular: 0x101010, side: THREE.DoubleSide } )    
    groundMat.color.setHSL( 0.095, 1, 0.75 );
    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.rotation.x = Math.PI/2;
    ground.position.y = offsetYdirToPlane;
    scene.add( ground );
    ground.receiveShadow = true;
     // SKYDOME
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 500, 0 );
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
    
    // Pole for the coil 
    var cubeGeometry = new THREE.CubeGeometry( ceilingX, ceilingY, ceilingZ );
    var cubeGeometry1 = new THREE.CubeGeometry( 10, 10, 75 );
    var cubeMaterial = new THREE.MeshPhongMaterial( { shininess: 20, ambient: 0x555555, color: 0xffffff, specular: 0x111111} );
    //var cubeMaterial = new THREE.MeshLambertMaterial();
    var ceilingMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
    var ceilingMesh1 = new THREE.Mesh( cubeGeometry1, cubeMaterial );
    ceilingMesh.rotation.x = Math.PI/2;
    ceilingMesh.rotation.z = Math.PI/2;
    ceilingMesh1.rotation.x = Math.PI/2;
    ceilingMesh.position.set(0,offsetYdirToPlane+offsetYdirToCoil,0);
    ceilingMesh1.position.set(20,offsetYdirToPlane+offsetYdirToCoil/2,0);
    
    scene.add(ceilingMesh1);
    scene.add(ceilingMesh);
    
    //scene.add(pole);
    //pole.castShadow = true;
    //pole.receiveShadow = true;
    //pole.castShadow = true;
    //pole.receiveShadow = true;

    // Lighting
    scene.add(new THREE.AmbientLight(0x999999));
    var spotLight = new THREE.SpotLight();
    spotLight.position.set(0, -100,-100);
    spotLight.angle = Math.PI/2;
    spotLight.castShadow = true;
    //scene.add(spotLight);
    var lightBulb = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshLambertMaterial({emissive:"#ffff00"}));
    lightBulb.position = spotLight.position;
    //scene.add(lightBulb);
    
    
    // Chrome mass of the coil
    var sphereGeom =  new THREE.SphereGeometry( 10, 100, 100 ); // radius, segmentsWidth, segmentsHeight
    mirrorSphereCamera = new THREE.CubeCamera( 0.01, 10000, 112 );
    scene.add( mirrorSphereCamera );
    var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
    mirrorSphere = new THREE.Mesh( sphereGeom, mirrorSphereMaterial );
    //mirrorSphere.position.y = offsetYdirToPlane;
    mirrorSphere.position.set(0,offsetYdirToPlane+offsetYdirToCoil+springLength,0);
    mirrorSphereCamera.position = mirrorSphere.position;
    mirrorSphere.castShadow = true;
    mirrorSphere.receiveShadow = true;
    scene.add(mirrorSphere);
    
    drawCoil();
}
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

/* Draw coil geometry */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
function drawCoil() {
    var myCoil = new Coil;
    var tubeGeometry = new THREE.TubeGeometry(myCoil, segments, tubeRadius, radiusSegments);
    if (coilMesh) {
	scene.remove( coilMesh );
    }
    //tubeGeometry.rotation(Math.PI);
    coilMesh = new THREE.Mesh( tubeGeometry,new THREE.MeshPhongMaterial({
        ambient: new THREE.Color().setRGB(0.19225,0.19225,0.19225),
        specular: new THREE.Color().setRGB(0.508273,0.508273,0.508273),
        emissive: new THREE.Color().setRGB(0.50754,0.50754,0.50754),
        shininess: 100,
        color: 0xf0f0f
      }));
    // translation
    coilMesh.position.set(0,offsetYdirToPlane+offsetYdirToCoil+2.5,0);
    // rotate by 90 degrees
    coilMesh.rotation.set(0,Math.PI/2,0);
    scene.add(coilMesh);
}
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

function drawCube(args) {
    var cubeGeometry = new THREE.CubeGeometry( ceilingX, ceilingY, ceilingZ );
}
