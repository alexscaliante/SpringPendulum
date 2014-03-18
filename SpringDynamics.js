/**
 * This object represents the dynamics of an ideal spring.
 * The methods of this object create functions (closures) of t implementing the different
 * dynamic behaviors of the pendulum.
 *
 * @constructor
 * @this {SpringDynamics}
 * @param {number} m mass in kg of pendulum mass.
 * @param {number} w0 eigenfrequency of the spring, must be > 0.
 * @param {number} d dimensionless friction constant, must be >= 0.
 */
function SpringDynamics(m, w0, d) {
    if(!(this instanceof SpringDynamics)) {
        return new SpringDynamics(w0, d);
    }
    this.m = m;
    this.w0 = w0;
    this.d = d;
    this.TOL = 0.00001;
}

/**
 * creates function x(t) calculating the pendulum position as function of t for given
 * initial conditions x(0) = x0 and x'(0) = v0 without external force.
 * @this {SpringDynamics}
 * @param {number} x0 initial position x(0)
 * @param {number} v0 initial speed x'(0)
 * @returns {function} function x(t) of a single parameter t giving the pendulum position at time t
 */
SpringDynamics.prototype.getInitCondFunc = function(x0, v0) {
    var ret;
    var that = this;
    var tmp, tmp2, tmp3, tmp4, tmp5;

    if(this.d < 1 - this.TOL) {
        // weak friction
        tmp = Math.sqrt(1-this.d*this.d);
        tmp2 = this.w0 * this.d;
        tmp3 = this.w0 * tmp;
        tmp4 = (v0 + this.d*this.w0*x0)/(this.w0*tmp);
        ret = function(t) {
            return x0*Math.exp(-tmp2*t)*Math.cos(tmp3*t) +
                tmp4*Math.exp(-tmp2*t)*Math.sin(tmp3*t);
        };
    } else if(this.d > 1 + this.TOL) {
        // strong friction
        tmp = Math.sqrt(this.d*this.d-1);
        tmp2 = this.w0 * (this.d- tmp);
        tmp3 = this.w0 * (this.d+ tmp);
        tmp4 = (v0 +this.d*this.w0*x0+this.w0*x0*tmp) / (2*this.w0*tmp);
        tmp5 = (v0 +this.d*this.w0*x0-this.w0*x0*tmp) / (2*this.w0*tmp);
        ret = function(t) {
            return tmp4 *Math.exp(-t*tmp2) - tmp5 * Math.exp(-t*tmp3);
        };
    } else {
        // limit case
        tmp = v0 + x0*this.w0;
        ret = function(t) {
            return (x0 + t * tmp)* Math.exp(-that.w0 * t);
        };
    }
    return ret;
};



/**
 * calculates the poles of the transfer function in the complex plane.
 *
 * @this {SpringDynamics}
 * @returns {Array} A two-element array, each element of which is again a
 *          two-element array containing real and imaginary parts of the poles
 */
SpringDynamics.prototype.getPoles = function() {
    var d = this.d;
    var w0 = this.w0;
    var poles = new Array(2);
    poles[0] = [0,0];
    poles[1] = [0,0];

    if(this.d < 1 - this.TOL) {
    // weak friction: poles with imaginary parts
        poles[0][0] = -w0*d;
        poles[0][1] =  w0*Math.sqrt(1-d*d);
        poles[1][0] = -w0*d;
        poles[1][1] = -w0*Math.sqrt(1-d*d);

    } else if(this.d > 1 + this.TOL) {
    // strong friction: no imaginary parts
        poles[0][0] = -w0*(d - Math.sqrt(d*d-1));
        poles[1][0] = -w0*(d + Math.sqrt(d*d-1));
    } else {
    // limit case:  real double pole at -w0
        poles[0][0] = -w0;
        poles[1][0] = -w0;
    }
    return poles;
};
