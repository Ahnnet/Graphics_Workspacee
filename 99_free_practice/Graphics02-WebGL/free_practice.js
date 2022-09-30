
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );   //canvas 넓이 재정의
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );    //배경색 지정

    //  Configure WebGL
    var vertices = [
        vec2(-1.0, -1.0),
        vec2(-0.5, 0.0),
        vec2(0.0, -1.0)
    ];

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );
    // Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    
    var vColors = gl.getUniformLocation(program, "vColors");    
    gl.uniform4fv( vColors, [1.0, 1.0, 0.0]);


    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
