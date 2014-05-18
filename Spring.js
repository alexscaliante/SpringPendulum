var SpringConsts = {
    // Spring constants
    springLength:	20, 	// natural length of spring
    windingFactor:	40,
    segments:		100,
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
	xFunc = Math.cos(u*SpringConsts.windingFactor) * (SpringConsts.springLength/4);
	zFunc = Math.sin(u*SpringConsts.windingFactor) * (SpringConsts.springLength/4);
	yFunc = - (SpringConsts.springLength + this.anchorDisplacement - this.dynamics(this.t)) * u;
	return new THREE.Vector3(xFunc, yFunc, zFunc);
    }
);

// spring shape
function Spring(dynamics)
{
    if(!(this instanceof Spring)) {
        return new Spring(dynamics);
    }
    
    this.dynamics = dynamics;
}

Spring.prototype.genGeometry = function(anchorDisplacement, t)
{
    return new SpringCurve(anchorDisplacement, this.dynamics, t);
}
    
Spring.prototype.updateDynamics = function(dynamics)
{
    this.dynamics = dynamics;
}

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
/* Draw spring geometry */
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
   
function drawSpring(ut, t)
{
    var tubeGeometry = new THREE.TubeGeometry(mySpring.genGeometry(ut, t/1000), SpringConsts.segments, SpringConsts.tubeRadius, SpringConsts.radiusSegments);
    if (springMesh) {
	scene.remove( springMesh );
    }
    
    springMesh = new THREE.Mesh( tubeGeometry,new THREE.MeshPhongMaterial({
        //ambient: new THREE.Color().setRGB(0.19225,0.19225,0.19225),
        //specular: new THREE.Color().setRGB(0.508273,0.508273,0.508273),
        //emissive: new THREE.Color().setRGB(0.50754,0.50754,0.50754),
        //shininess: 100,
        color: 0x0f0f0f
      }));
    
    // translation
    springMesh.position.set(0,SpringPendulumConsts.offsetCeiling-SpringPendulumConsts.ceilingZ/2+ut,0);
    scene.add(springMesh);
 
    return tubeGeometry.vertices[tubeGeometry.vertices.length-1].y;
}