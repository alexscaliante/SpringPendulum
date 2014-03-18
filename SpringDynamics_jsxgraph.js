var m = 1;
var w0 = 2;
var d = 1;
var sd = new SpringDynamics(m, w0, d);

var brd1 = JXG.JSXGraph.initBoard('jxgbox1',
                                  {boundingbox:[-0.1, 1.2, 5, -1.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});


var x0 = 0.5;
var v0 = -1;
var func = sd.getInitCondFunc(x0, v0);
brd1.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});

d = 2;
sd = new SpringDynamics(m, w0, d);
var brd2 = JXG.JSXGraph.initBoard('jxgbox2',
                                  {boundingbox:[-0.1, 1.2, 5, -1.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});
func = sd.getInitCondFunc(x0, v0);
brd2.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});

d = 0.2;
sd = new SpringDynamics(m, w0, d);
var brd3 = JXG.JSXGraph.initBoard('jxgbox3',
                                  {boundingbox:[-0.1, 1.2, 5, -1.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});
func = sd.getInitCondFunc(x0, v0);
brd3.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});
