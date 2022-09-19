
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );   //canvas 넓이 재정의
    gl.clearColor(0.0, 0.2, 0.5, 1.0 );    //배경색 지정 //남색

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //  Configure WebGL
        // vertex


        // color
    var colors = [
        vec3(1.0, 1.0, 1.0), //w
        vec3(0.0, 1.0, 0.0), //g
        vec3(1.0, 1.0, 0.0) //y
    ];

    // Load the data into the GPU
    // vColor

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);


    // vResolution
    var vResolution = gl.getUniformLocation(program, "vResolution");


    // Load the data into the GPU
    // vPosition
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); 
        //bufferData 안했음 -> function에서 할것
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    // Triangle (Mountain)
    for(var i=0; i<3; ++i){
        setMountain(gl, randomInt(300), randomInt(300), randomInt(300));

        gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }


    // // Pentagon (star)
    // for(var i=0; i<4; ++i){
    //     setStar();

    //     gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);

    //     gl.drawArrays(gl.TRIANGLES, 0, 3);
    // }


    // // Hexagon (cloud)
    // for(var i=0; i<3; ++i){
    //     setCloud();

    //     gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);

    //     gl.drawArrays(gl.TRIANGLES, 0, 3);
    // }
};

function randomInt(range){
    return Math.floor(Math.random()*range);
}

function setMountain(gl, x, y, h){
    x1 = x;
    x2 = x + h;
    y = y;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1,0,
        x2,0,
        (x1+x2)/2,y
    ]), gl.STATIC_DRAW);
}

function setStar(){

}

function setCloud(){

}
