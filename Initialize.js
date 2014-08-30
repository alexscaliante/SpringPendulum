"use strict";

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
/* Global Variables */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

// standard global variables
var scene,camera,renderer,controls;
// custom global variables
var springMesh,mirrorSphere,mirrorSphereCamera,ceilingMesh,runningFlag,startTime,staticRendered,timeDomainFollow,pushrodMesh;

var SpringPendulumConsts = {
    ballRadius: 10,
    ceilingX: 50,
    ceilingY: 15,
    ceilingZ: 5,
    poleX: 15,
    poleY: 15,
    poleZ: 90,
    offsetPlane: 33,
    pushrodHight : 20,
    pushrodRadius : 4
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
    //renderer.setClearColor('rgb(0,0,0)');  // black background
    renderer.shadowMapEnabled = true;

    scene = new THREE.Scene();
    
    scene.fog = new THREE.FogExp2( new THREE.Color(0xffffff),0.0009 );
    //scene.fog.color.setHSL( 0.6, 0, 1 );

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 10000 );
    camera.position.set( -100, 125, 100);
    
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
    var groundTexture = THREE.ImageUtils.loadTexture( "images/grasslight-big.jpg" );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( {/*color: 0xffffff, specular: 0x111111,*/ map: groundTexture,side: THREE.DoubleSide } )    
    //groundMat.color.setHSL( 0.095, 1, 0.75 );
    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.rotation.x = -Math.PI/2;
    ground.position.y = SpringPendulumConsts.offsetPlane;
    ground.receiveShadow = true;
    scene.add( ground );
    
    // Lighting
    
    var light;
    var d = 300;
    var hemiLight = new THREE.HemisphereLight( 0x111111, 0x111111, 0.8 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.333, 1, 0.4 );
    hemiLight.position.set( 0, 200, 0 );
    //scene.add( hemiLight );
    scene.add( new THREE.AmbientLight( 0x666666 ) );
    light = new THREE.DirectionalLight( 0xdfebff, 0.5 );
    light.position.set( -100, 150, 150 );
    light.castShadow = true;
    light.shadowMapWidth = 2500;
    light.shadowMapHeight = 2500;
    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;
    light.shadowCameraFar = 500;
    light.shadowDarkness = 0.5;
    scene.add( light );
    
    // Skydome
   
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
    /*
    var cube_geometry = new THREE.CubeGeometry( 3, 3, 3 );
		var cube_mesh = new THREE.Mesh( cube_geometry );
		cube_mesh.position.x = -7;
		var cube_bsp = new ThreeBSP( cube_mesh );

		var sphere_geometry = new THREE.SphereGeometry( 1.8, 32, 32 );
		var sphere_mesh = new THREE.Mesh( sphere_geometry );
		sphere_mesh.position.x = -7;
		var sphere_bsp = new ThreeBSP( sphere_mesh );
		
		var subtract_bsp = cube_bsp.subtract( sphere_bsp );
		var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading, map: THREE.ImageUtils.loadTexture('images/grasslight-big.jpg') }) );
		result.geometry.computeVertexNormals();
		scene.add( result );
    
    */
    var ceilingGeometry = new THREE.CubeGeometry( SpringPendulumConsts.ceilingX, SpringPendulumConsts.ceilingY, SpringPendulumConsts.ceilingZ );
    
    var poleGeometry1 = new THREE.CubeGeometry( SpringPendulumConsts.poleX, SpringPendulumConsts.poleY, SpringPendulumConsts.poleZ*0.8-10-SpringPendulumConsts.ceilingZ/2 );
    var poleGeometry2 = new THREE.CubeGeometry( SpringPendulumConsts.poleX/2, SpringPendulumConsts.poleY, 10*2+SpringPendulumConsts.ceilingZ );
    var poleGeometry3 = new THREE.CubeGeometry( SpringPendulumConsts.poleX, SpringPendulumConsts.poleY, SpringPendulumConsts.poleZ*0.2-10-SpringPendulumConsts.ceilingZ/2);
    console.log(poleGeometry3);
    var poleMaterial = new THREE.MeshPhongMaterial( { shininess: 100, ambient: 0x555555, color: 0xffffff, specular: 0x111111} );
    
    ceilingMesh = new THREE.Mesh( ceilingGeometry, poleMaterial );
    var poleMesh1 = new THREE.Mesh( poleGeometry1, poleMaterial );
    var poleMesh2 = new THREE.Mesh( poleGeometry2, poleMaterial );
    var poleMesh3 = new THREE.Mesh( poleGeometry3, poleMaterial );
    
    
    ceilingMesh.rotation.x = Math.PI/2;
    
    
    ceilingMesh.position.set(0,SpringPendulumConsts.offsetCeiling,0);

    var offsetZ = SpringPendulumConsts.offsetPlane+(poleGeometry1.depth/2);
    poleMesh1.position.set(SpringPendulumConsts.ceilingX/2,offsetZ,0);
    offsetZ += (poleGeometry1.depth/2) + (poleGeometry2.depth/2);
    poleMesh2.position.set(SpringPendulumConsts.ceilingX/2+poleGeometry2.width/2,offsetZ,0);
    offsetZ += (poleGeometry2.depth/2) + (poleGeometry3.depth/2);
    poleMesh3.position.set(SpringPendulumConsts.ceilingX/2,offsetZ,0);
    
    poleMesh1.receiveShadow = true;
    poleMesh1.castShadow = true;
    ceilingMesh.receiveShadow = true;
    ceilingMesh.castShadow = true;
    
    poleMesh1.rotation.x = Math.PI/2;
    poleMesh2.rotation.x = Math.PI/2;
    poleMesh3.rotation.x = Math.PI/2;
    
    
    var cylinderGeometry = new THREE.CylinderGeometry(SpringPendulumConsts.pushrodRadius, SpringPendulumConsts.pushrodRadius, SpringPendulumConsts.pushrodHight, 50, 50, false);
    var cylinderMaterial = new THREE.MeshPhongMaterial( { shininess: 50, ambient: 0x555555, color: 0x000000, specular: 0x111111} );
    pushrodMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    
    scene.add(pushrodMesh);
    scene.add(poleMesh1);
    //scene.add(poleMesh2);
    //scene.add(poleMesh3); 
    scene.add(ceilingMesh);
    
    /*
    var matlight = new THREE.MeshPhongMaterial({emissive:"rgb(255,0,0)"});
    matlight.shading = THREE.FlatShading;
    var lightBulb = new THREE.SphereGeometry(10);
    var lightBulbobj = new THREE.Mesh(lightBulb, matlight);
    scene.add(lightBulbobj);
    lightBulbobj.position = light.position;	
    */
    
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
