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
        activeIndex: [0,1],
        multiple: true
    });
    
    // init buttons
    $("#control-buttons").buttonset();
    
    $("#button-start").button({
        icons: { primary: "ui-icon-play"}
    }).click( function(event){
        
        DisableSliders();
        CalculateNewSpringDynamics();
        renderflag = 1;
    });
    
    $("#button-stop").button({
        icons: { primary: "ui-icon-stop"}
    }).click( function(event){
        
        EnableSlider();
        renderflag = 0;
    });
    
    // init sliders
    $("#eigenfrequency-slider").slider({ 
        value:1,
        min: 0.1,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#eigenfrequency").val(ui.value);
           
        }
    });
    $("#eigenfrequency").val($("#eigenfrequency-slider").slider("value"));
    
    $("#damping-slider").slider({
        value:1,
        min: 0.1,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#damping").val(ui.value);
        }
    });
    $("#damping").val($("#damping-slider").slider("value"));            
    
    $("#initpos-slider").slider({
        value:1,
        min: 0.1,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#initpos").val(ui.value);
        }
    });
    $("#initpos").val($("#initpos-slider").slider("value"));
    
    $("#initveloc-slider").slider({
        value:1,
        min: 0.1,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#initveloc").val(ui.value);
        }
    });
    $("#initveloc").val($("#initveloc-slider").slider("value"));
    
    $("#extforce-amp-slider").slider({
        value:1,
        min: 0.1,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#extforce-amp").val(ui.value);
        }
    });
    $("#extforce-amp").val($("#extforce-amp-slider").slider("value"));
    
    $("#extforce-freq-slider").slider({
        value:1,
        min: 0.1,
        max: 10,
        step: 0.1,
        slide: function( event, ui ) {
            $("#extforce-freq").val(ui.value);
        }
    });
    $("#extforce-freq").val($("#extforce-freq-slider").slider("value"));
    
    // Disable all sliders for the first time
    DisableSliders();

    resize_canvas();            
});
function CalculateNewSpringDynamics() {
    
    w0 = $("#eigenfrequency").val(); // eigen-frequency
    d =  $("#damping").val();        // damping
    sd = new SpringDynamics(w0, d);
    u0 =  $("#extforce-amp").val(); // amp of external force
    we = $("#extforce-freq").val(); // external frequency
    selectedDynamics = sd.getExtForceFunc(u0,we);
    responseGraph.Y = selectedDynamics;
    responseGraph.updateCurve();
    responseGraphBoard.update();
    
   
}

function EnableSlider() {
    $("#eigenfrequency-slider").slider("enable");
    $("#damping-slider").slider("enable");
    $("#initpos-slider").slider("enable");
    $("#initveloc-slider").slider("enable");
    $("#extforce-amp-slider").slider("enable");
    $("#extforce-freq-slider").slider("enable");

}
function DisableSliders() {
    $("#eigenfrequency-slider").slider("disable");
    $("#damping-slider").slider("disable");
    $("#initpos-slider").slider("disable");
    $("#initveloc-slider").slider("disable");
    $("#extforce-amp-slider").slider("disable");
    $("#extforce-freq-slider").slider("disable");
    
}