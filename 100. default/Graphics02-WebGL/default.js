
var gl;
var points;
var flag = 0;
var trans = 0;
var ctm;
var redraw = false;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    var vertices = [
        vec2(-0.5, -0.5),
        vec2( 0, 0.5),
        vec2 (0.5, -0.5)];

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

/////////////////////////////////////
    canvas.addEventListener("mousedown", function(event){
        redraw = true;
    });

    canvas.addEventListener("mouseup", function(event){
        redraw = false;
    });
    
    canvas.addEventListener("mousemove", function(event){
        if(redraw){
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            var t=vec2(2*event.clientX/canvas.width-1, 2*(canvas.height-event.clientY)/canvas.height-1);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8, flatten(t));

        }
    })

/////////////////////////////////////




    // Load the data into the GP

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );

    // Associate vertex data buffer with shader variables

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



//////////////////////////////////////

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");


//////////////////////////////////////


    document.getElementById("btnRight").onclick = function(){
        flag = 1;
        render();
    }

    document.getElementById("btnLeft").onclick = function(){
        flag = -1;
        render();
    }

    render();
};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    trans+=0.002*flag;

    ctm = mat4();
    ctm = mult(ctm, translate(trans, 0.0, 0.0, 0.0));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));

    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    requestAnimationFrame(render);
}
