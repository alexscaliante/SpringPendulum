function resize_canvas()
{           
    var canvas = document.getElementById("mycanvas");
    var divcanvas = $("#canvas-container");
    
    canvas.width = divcanvas.width();
    canvas.height = divcanvas.height();
    
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

$(function() {
    $("#tabs").puiaccordion({
        activeIndex: [0,1,2],
        multiple: true
    });
    
    // init buttons
    $("#control-buttons").buttonset();
    
    $("#button-start").button({
        icons: { primary: "ui-icon-play"},
        disabled: true
    }).click( function(event){
        $(this).button("disable");
        $(this).next().button("enable");
        disableSliders();
        runningFlag = true;
    });
    
    $("#button-stop").button({
        icons: { primary: "ui-icon-stop"}
    }).click( function(event){
        $(this).button("disable");
        $(this).prev().button("enable");
        startTime = undefined;
        enableSlider();
        runningFlag = false;
    });
        
    // init sliders
    $("#eigenfrequency-slider").slider({ 
        value: SpringPendulumParams.w0,
        min: 0.1,
        max: 50,
        step: 0.1,
        slide: function( event, ui ) {
            $("#eigenfrequency").val(ui.value);
            SpringPendulumParams.changeParam("w0",ui.value);
            $("#initveloc-slider").slider("option", "min", SpringConsts.springLength * ui.value * -0.4);
            $("#initveloc-slider").slider("option", "max", SpringConsts.springLength * ui.value * 0.4)
            if ($("#initveloc-slider").slider("option","value") > $("#initveloc-slider").slider("option","max")) {
                $("#initveloc-slider").slider("option","value",$("#initveloc-slider").slider("option","max"));
            } else if ($("#initveloc-slider").slider("option","value") < $("#initveloc-slider").slider("option","min")) {
                $("#initveloc-slider").slider("option","value",$("#initveloc-slider").slider("option","min"));
            }
            updateSpringDynamics();
        }
    });
    $("#eigenfrequency").val($("#eigenfrequency-slider").slider("value"));
    
    $("#damping-slider").slider({
        value: SpringPendulumParams.d,
        min: 0.1,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#damping").val(ui.value);
            SpringPendulumParams.changeParam("d",ui.value);
            updateSpringDynamics();
        }
    });
    $("#damping").val($("#damping-slider").slider("value"));            
    
    $("#initpos-slider").slider({
        value: SpringPendulumParams.y0,
        min: SpringConsts.springLength * -0.4,
        max: SpringConsts.springLength * 0.4,
        step: 0.1,
        slide: function( event, ui ) {
            $("#initpos").val(ui.value);
            SpringPendulumParams.changeParam("y0",ui.value);
            updateSpringDynamics();
        }
    });
    $("#initpos").val($("#initpos-slider").slider("value"));
    
    $("#initveloc-slider").slider({
        value: SpringPendulumParams.v0,
        min: SpringConsts.springLength * SpringPendulumParams.w0 * -0.4,
        max: SpringConsts.springLength * SpringPendulumParams.w0 * 0.4,
        step: 0.1,
        slide: function( event, ui ) {
            $("#initveloc").val(ui.value);
            SpringPendulumParams.changeParam("v0",ui.value);
            updateSpringDynamics();
        }
    });
    $("#initveloc").val($("#initveloc-slider").slider("value"));
    
    $("#extforce-amp-slider").slider({
        value: SpringPendulumParams.u0,
        min: 0,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#extforce-amp").val(ui.value);
            SpringPendulumParams.changeParam("u0",ui.value);
            updateSpringDynamics();
        }
    });
    $("#extforce-amp").val($("#extforce-amp-slider").slider("value"));
    
    $("#extforce-freq-slider").slider({
        value: SpringPendulumParams.we,
        min: 0,
        max: 50,
        step: 0.1,
        slide: function( event, ui ) {
            $("#extforce-freq").val(ui.value);
            SpringPendulumParams.changeParam("we",ui.value);
            updateSpringDynamics();
        }
    });
    $("#extforce-freq").val($("#extforce-freq-slider").slider("value"));
    
    // Disable all sliders for the first time
    disableSliders();
    resize_canvas();            
});

function enableSlider() {
    $("#eigenfrequency-slider").slider("enable");
    $("#damping-slider").slider("enable");
    $("#initpos-slider").slider("enable");
    $("#initveloc-slider").slider("enable");
    $("#extforce-amp-slider").slider("enable");
    $("#extforce-freq-slider").slider("enable");
}

function disableSliders() {
    $("#eigenfrequency-slider").slider("disable");
    $("#damping-slider").slider("disable");
    $("#initpos-slider").slider("disable");
    $("#initveloc-slider").slider("disable");
    $("#extforce-amp-slider").slider("disable");
    $("#extforce-freq-slider").slider("disable");
    
}