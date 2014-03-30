var w0 = 5;
var d = 0.5;
var sd = new SpringDynamics(w0, d);

var brd1 = JXG.JSXGraph.initBoard('jxgbox1',
                                  {boundingbox:[-0.1, 1.2, 5, -1.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});


var x0 = 0.5;
var v0 = 1;
var func = sd.getInitCondFunc(x0, v0);
brd1.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});

d = 2;
sd = new SpringDynamics(w0, d);
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
sd = new SpringDynamics(w0, d);
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



d=2;
sd = new SpringDynamics(w0, d);
var brd4 = JXG.JSXGraph.initBoard('jxgbox4',
                                  {boundingbox:[-0.1, 1.2, 5, -1.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});
func = sd.getImpResp();
brd4.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});

d=1;
sd = new SpringDynamics(w0, d);
var brd5 = JXG.JSXGraph.initBoard('jxgbox5',
                                  {boundingbox:[-0.1, 1.2, 5, -1.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});
func = sd.getImpResp();
brd5.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});
d=0.2;
sd = new SpringDynamics(w0, d);
var brd6 = JXG.JSXGraph.initBoard('jxgbox6',
                                  {boundingbox:[-0.1, 1.2, 5, -1.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});
func = sd.getImpResp();
brd6.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});

var brd7 = JXG.JSXGraph.initBoard('jxgbox7',
                                  {boundingbox:[-0.1, 3.2, 5, -3.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});
var u0 = 1.4;
var we = 1.6;
func = sd.getExtForceFunc(u0, we);
brd7.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});

sd = new SpringDynamics(2,0.2);
func = sd.getStepResp();
var brd8 = JXG.JSXGraph.initBoard('jxgbox8',
                                  {boundingbox:[-0.1, 3.2, 5, -3.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});

brd8.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});



u0 = 1.4;
we = 1.6;
var y0 = 0.5;
v0 = 1.3;
sd = new SpringDynamics(2, 1.8);
func = sd.getPositionFunc(u0, we, y0,v0);
var brd9= JXG.JSXGraph.initBoard('jxgbox9',
                                  {boundingbox:[-0.1, 3.2, 5, -3.2],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});

brd9.create('functiongraph',
            [func],
            {strokeColor:'blue', strokeWidth:2});


sd = new SpringDynamics(2, 0.2);
func = sd.getMagRespFunc();
var brd10 = JXG.JSXGraph.initBoard('jxgbox10',
                                  {boundingbox:[-0.1, 5, 5, -3],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});

brd10.create('functiongraph',
             [function(w) {return func(w,false);}],
             {strokeColor:'blue', strokeWidth:2});


var brd11 = JXG.JSXGraph.initBoard('jxgbox11',
                                  {boundingbox:[-0.1, 10, 5, -10],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});

brd11.create('functiongraph',
             [func],
             {strokeColor:'blue', strokeWidth:2});

func = sd.getPhaseRespFunc();
var brd12 = JXG.JSXGraph.initBoard('jxgbox12',
                                  {boundingbox:[-0.1, 10, 5, -200],
                                  keepaspectratio:false,
                                  axis:true,
                                  showCopyright: false,
                                  showNavigation: false});

brd12.create('functiongraph',
             [func],
             {strokeColor:'blue', strokeWidth:2});
