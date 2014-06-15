/**
 * This object represents the dynamics of an ideal spring.
 * The methods of this object create functions (closures) of t implementing the different
 * dynamic behaviors of the pendulum.
 *
 * @constructor
 * @this {SpringDynamics}
 * @param {number} w0 eigenfrequency of the spring, must be > 0.
 * @param {number} d dimensionless friction constant, must be >= 0.
 */



function SpringDynamics(w0, d) {
    if(!(this instanceof SpringDynamics)) {
        return new SpringDynamics(w0, d);
    }

    // assert(w0>0);
    // assert(d>=0);
    this.w0 = w0;
    this.d = d;
    this.TOL = 0.00001;
}

/**
 * creates function y(t) calculating the pendulum position as function of t for given
 * initial conditions y(0) = y0 and y'(0) = v0 without external force.
 * @this {SpringDynamics}
 * @param {number} y0 initial position y(0)
 * @param {number} v0 initial speed y'(0)
 * @returns {function} function y(t) of a single parameter t giving the pendulum position at time t
 */
SpringDynamics.prototype.getInitCondFunc = function(y0, v0) {
    var ret;
    var that = this;
    var tmp, tmp2, tmp3, tmp4, tmp5;
    var w0 = this.w0;
    var d = this.d;

    if(d < 1 - this.TOL) {
        // weak friction
        tmp = Math.sqrt(1-d*d);
        tmp2 = w0 * d;
        tmp3 = w0 * tmp;
        tmp4 = (v0 + d*w0*y0)/(w0*tmp);
        ret = function(t) {
            return y0*Math.exp(-tmp2*t)*Math.cos(tmp3*t) +
                tmp4*Math.exp(-tmp2*t)*Math.sin(tmp3*t);
        };
    } else if(d > 1 + this.TOL) {
        // strong friction
        tmp = Math.sqrt(d*d-1);
        tmp2 = w0 * (d- tmp);
        tmp3 = w0 * (d+ tmp);
        tmp4 = (v0 +d*w0*y0+w0*y0*tmp) / (2*w0*tmp);
        tmp5 = (v0 +d*w0*y0-w0*y0*tmp) / (2*w0*tmp);
        ret = function(t) {
            return tmp4 *Math.exp(-t*tmp2) - tmp5 * Math.exp(-t*tmp3);
        };
    } else {
        // limit case
        tmp = v0 + y0*w0;
        ret = function(t) {
            return (y0 + t * tmp)* Math.exp(-that.w0 * t);
        };
    }
    return ret;
};


/**
 * creates function h(t) calculating the impulse response of the pendulum
 * @this {SpringDynamics}
  * @returns {function} function h(t) of a single parameter t giving the pendulum position at time t
 */
SpringDynamics.prototype.getImpResp = function() {
    var ret;
    var that = this;
    var tmp, tmp2, tmp3, tmp4;
    var w0 = this.w0;
    var d = this.d;

    if(d < 1 - this.TOL) {
        // weak friction
        tmp = w0 * Math.sqrt(1-d*d);
        tmp2 = w0 * d;
        tmp3 = w0 / Math.sqrt(1-d*d);
        ret = function(t) {
            if(t<0) return 0;
            else return tmp3 * Math.exp(-tmp2*t)*Math.sin(tmp*t);
        };
     } else if(d > 1 + this.TOL) {
         // strong friction
         tmp = Math.sqrt(d*d-1);
         tmp2 = w0/(2 * tmp);
         tmp3 = w0*(tmp-d);
         tmp4 = w0*(-tmp-d);
         ret = function(t) {
             if(t<0) return 0;
             else return tmp2*(Math.exp(tmp3*t) - Math.exp(tmp4*t));
        };
     } else {
         // limit case
         ret = function(t) {
             if(t<0) return 0;
             else return t*that.w0*that.w0*Math.exp(-that.w0*t);
         };
     }
    return ret;
};

/**
 * creates function h(t) calculating the impulse response of the pendulum
 * @this {SpringDynamics}
  * @returns {function} function h(t) of a single parameter t giving the pendulum position at time t
 */
SpringDynamics.prototype.getStepResp = function() {
    var ret;
    var tmp, tmp2, tmp3, tmp4;
    var w0 = this.w0;
    var d = this.d;

    if(d < 1 - this.TOL) {
        // weak friction
        tmp = Math.sqrt(1-d*d);
        tmp2 = w0 * tmp;
        tmp3 = d/tmp;
        ret = function(t) {
            if(t<0) return 0;
            else return 1 - Math.exp(-d*w0*t)*(Math.cos(tmp2*t) + tmp3*Math.sin(tmp2*t));
        };
     } else if(d > 1 + this.TOL) {
         // strong friction
         tmp = Math.sqrt(d*d-1);
         tmp2 = 1+d / tmp;
         tmp3 = 1-d / tmp;
         tmp4 = w0*tmp;
         ret = function(t) {
             if(t<0) return 0;
             else return 1- 0.5*Math.exp(-d*w0*t)*(tmp2* Math.exp(tmp4*t) + tmp3* Math.exp(-tmp4*t) );
        };
     } else {
         // limit case
         ret = function(t) {
             if(t<0) return 0;
             else return 1-(t*w0+1)*Math.exp(-w0*t);
         };
     }
    return ret;
};


/**
 * creates function y(t) calculating the pendulum position as function of t for vanishing
 * initial conditions but with external force exerted by motion u(t) = u0*sin(we*t) of the
 * upper suspension point of the pendulum.
 * @this {SpringDynamics}
 * @param {number} u0 amplitude of suspension point
 * @param {number} we external frequency
 * @returns {function} function y(t) of a single parameter t giving the pendulum position at time t
 */
SpringDynamics.prototype.getExtForceFunc = function(u0, we) {
    var ret;
    var that = this;
    var tmp, tmp2, tmp3, tmp4;
    var w0 = this.w0;
    var d = this.d;

    if(d < 1 - this.TOL) {
        tmp = Math.sqrt(1-d*d);  // tmp=D
        tmp2 = w0*d;
        // tmp3=A
        tmp3 = u0 * w0*w0 / ((4*d*d-2)*w0*w0*we*we
                                       + w0*w0*w0*w0 +we*we*we*we);
        tmp4 = ((2*d*d-1)*w0*w0+we*we)/(2*tmp2*w0*tmp);

        ret = function(t) {
            return 2*tmp2*we*tmp3*Math.exp(-tmp2*t)
                * (Math.cos(w0*tmp*t) + tmp4*Math.sin(w0*tmp*t))
                - tmp3 * (we*we-w0*w0)*Math.sin(we*t)
                - 2 * tmp3 *tmp2*we*Math.cos(we*t);
        };
    } else if(d > 1 + this.TOL) {

        tmp = Math.sqrt(d*d-1);   // = D
        tmp2 = u0*w0*w0/(4 * d*d*w0*w0*we*we+w0*w0*w0*w0-2*w0*w0*we*we+we*we*we*we);  // A
        tmp3 = ((2*d*d-1)*w0*w0+we*we)/(2*d*w0*w0*tmp);

        ret = function(t) {
            return d*tmp2*w0*we*Math.exp(-t*d*w0)*(Math.exp(t*w0*tmp)*(1+tmp3)
                                                   +Math.exp(-t*w0*tmp)*(1-tmp3))
            +tmp2*((w0*w0-we*we)*Math.sin(we*t)-2*d*w0*we*Math.cos(we*t));
        };
    } else {
        // limit case
        tmp = w0*w0 + we*we;
        tmp2 = u0*w0*w0/tmp;   // = B
        tmp3 = tmp2 / tmp;  // = A

        ret = function(t) {
            return (2*tmp3*w0+t*tmp2)*we*Math.exp(-t*w0)
            + tmp3 * (w0*w0 - we*we) * Math.sin(t*we)
            - 2 * tmp3 * w0*we* Math.cos(t*we);
         };
     }

    return ret;
};


/**
 * creates function y(t) calculating the pendulum position as function of t with
 * initial conditions and with external force exerted by motion u(t) = u0*sin(we*t) of the
 * upper suspension point of the pendulum. It is just the sum of getInitCondFunc and getExtForceFunc.
 * @this {SpringDynamics}
 * @param {number} u0 amplitude of suspension point
 * @param {number} we external frequency
 * @param {number} y0 initial position y(0)
 * @param {number} v0 initial speed y'(0)
 * @returns {function} function y(t) of a single parameter t giving the pendulum position at time t
 */
SpringDynamics.prototype.getPositionFunc = function(u0, we, y0, v0) {
    var f1 = this.getInitCondFunc(y0, v0);
    var f2 = this.getExtForceFunc(u0, we);
    var ret = function(t) {
        return f1(t) + f2(t);
    };
    return ret;
};


/**
 * creates function func(w) calculating the magnitude response of the system as a function of the
 * frequency w. A flag of the returned function controls whether the magnitude response |H| or
 * the logarithmic quantity
 * -20*log10(|H|) is calculated.
 * @this {SpringDynamics}
 * @returns {function} function func w of a single parameter w giving the magnitude response
 */
SpringDynamics.prototype.getMagRespFunc = function(dB) {

    if(dB===undefined) dB = true;

    var ret;
    var w02 = this.w0*this.w0;
    var d2 = this.d*this.d;

    // the dB flag indicates whether or not to return a logarithmic magnitude response
    ret = function(w, dB) {
        var w2 = w*w;
        var absH = w02 / Math.sqrt((4*d2-2)*w02*w2 + w2*w2 + w02*w02);
        if(dB) {
            return 20*Math.LOG10E*Math.log(absH);
        } else {
            return absH;
        }
        return 0;
    };
    return ret;
};

/**
 * creates function func(w) calculating the phase response in degrees of the system as a function of the
 * frequency w.
 * @this {SpringDynamics}
 * @returns {function} function func w of a single parameter w giving the phase response
 */
SpringDynamics.prototype.getPhaseRespFunc = function() {
    var ret;
    var w0 = this.w0;
    var d = this.d;
    var w02 = this.w0*this.w0;
    var d2 = this.d*this.d;

    ret = function(w) {
        var w2 = w*w;
        var den = (w02-w2)*(w02-w2) + 4*d2*w2*w02;
        var real =  w02*(w02-w2)/den;
        var imag = -2*d*w*w02*w0 / den;
        return Math.atan2(imag, real) * 180 / Math.PI;
    };
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

    if(d < 1 - this.TOL) {
    // weak friction: poles with imaginary parts
        poles[0][0] = -w0*d;
        poles[0][1] =  w0*Math.sqrt(1-d*d);
        poles[1][0] = -w0*d;
        poles[1][1] = -w0*Math.sqrt(1-d*d);

    } else if(d > 1 + this.TOL) {
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
