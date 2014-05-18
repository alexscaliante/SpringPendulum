var SpringConsts = {
    // Spring constants
    springLength:	4, 	// natural length of spring
    windingFactor:	40,
    segments:		500,
    radiusSegments:	6,
    tubeRadius:		0.5
}

var SpringCurve = THREE.Curve.create(
    function(anchorDisplacement, dynamics, t)
    {
	this.anchorDisplacement = anchorDisplacement;
	this.t = t;
	this.dynamics = dynamics;
    },
    function(u) 
    {
	// basic Helix shape
	xFunc = Math.cos(u*SpringConsts.windingFactor)*5;
	zFunc = Math.sin(u*SpringConsts.windingFactor)*5;
	yFunc = (SpringConsts.springLength-(this.anchorDisplacement/5)) * u * (1+this.dynamics(this.t))/* 
		(((SpringConsts.springLength * (1+this.dynamics(this.t))) - this.anchorDisplacement) / (SpringConsts.springLength*(1+this.dynamics(this.t))))*/;
	yFunc *= -5;	
	return new THREE.Vector3(xFunc, yFunc, zFunc);// the scalar simply increses the diameter of the spring
    }
);

// spring shape
function Spring(dynamics)
{
    if(!(this instanceof Spring)) {
        return new Spring(dynamics);
    }
    
    this.dynamics = dynamics;
    
    this.genGeometry = function(anchorDisplacement, t)
    {
	return new SpringCurve(anchorDisplacement, dynamics, t);
    }
}

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
/* Draw spring geometry */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
   
function drawSpring(ut, t)
{
    //console.log(selectedDynamics(t));
    var tubeGeometry = new THREE.TubeGeometry(mySpring.genGeometry(ut, t/1000), SpringConsts.segments, SpringConsts.tubeRadius, SpringConsts.radiusSegments);
    if (springMesh) {
	scene.remove( springMesh );
    }
    //tubeGeometry.rotation(Math.PI);
    springMesh = new THREE.Mesh( tubeGeometry,new THREE.MeshPhongMaterial({
        ambient: new THREE.Color().setRGB(0.19225,0.19225,0.19225),
        specular: new THREE.Color().setRGB(0.508273,0.508273,0.508273),
        emissive: new THREE.Color().setRGB(0.50754,0.50754,0.50754),
        shininess: 100,
        color: 0xf0f0f
      }));
    
    // translation
    springMesh.position.set(0,SpringPendulumConsts.offsetCeiling-SpringPendulumConsts.ceilingZ/2+ut,0);
    // rotate by 90 degrees
    springMesh.rotation.set(0,Math.PI,0);
    scene.add(springMesh);
}