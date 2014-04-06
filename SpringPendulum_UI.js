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
    $("#button-start").button( "option", "icons", { primary: "ui-icon-play" } );
    $("#button-stop").button( "option", "icons", { primary: "ui-icon-stop" } );
    
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
    resize_canvas();            
});