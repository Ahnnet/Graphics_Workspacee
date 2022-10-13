"use strict";

var canvas;
var gl;

var numVerticies = 84;

var points = [];
var colors = [];

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var near = 0.3;
var far = 3.0;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var fovy = 45.0;
var aspect = 1.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionViewMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);


function quad(a,b,c,d){
    var vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),

        vec4(-0.5, -0.5-1.0, 0.5, 1.0),
        vec4(-0.5, 0.5-1.0, 0.5, 1.0),
        vec4(0.5, 0.5-1.0, 0.5, 1.0),
        vec4(0.5, -0.5-1.0, 0.5, 1.0),
        vec4(-0.5, -0.5-1.0, -0.5, 1.0),
        vec4(-0.5, 0.5-1.0, -0.5, 1.0),
        vec4(0.5, 0.5-1.0, -0.5, 1.0),
        vec4(0.5, -0.5-1.0, -0.5, 1.0),

        vec4(-0.5+1.0, -0.5, 0.5, 1.0),
        vec4(-0.5+1.0, 0.5, 0.5, 1.0),
        vec4(0.5+1.0, 0.5, 0.5, 1.0),
        vec4(0.5+1.0, -0.5, 0.5, 1.0),
        vec4(-0.5+1.0, -0.5, -0.5, 1.0),
        vec4(-0.5+1.0, 0.5, -0.5, 1.0),
        vec4(0.5+1.0, 0.5, -0.5, 1.0),
        vec4(0.5+1.0, -0.5, -0.5, 1.0)
    ];

    var vertexColors = [
        [0.0, 0.0, 0.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 1.0]
    ];

    var indices = [a,b,c,a,c,d];

    for(var i=0;i<indices.length; ++i){
        points.push(vectices[indices[i]]);
        colors.push(vertexColors[a%8]);
    }
}

function colorCube(){
    quad( 1, 0, 3, 2 ); // blue
    // quad( 2, 3, 7, 6 ); // yellow
    // quad( 3, 0, 4, 7 ); // green
    quad( 6, 5, 1, 2 ); // cyan
    quad( 4, 5, 6, 7 ); // red       
    quad( 5, 4, 0, 1 ); // magenta

    quad(9,8,11,10);
    quad(10,11,15,14);
    quad(11,8,12,15);
    quad(12,13,14,15);
    quad(13,12,8,9);

    quad(17,16,19,18);
    quad(18,19,23,22);
    quad(19,16,20,23);
    quad(22,21,17,18);
    quad(20,21,22,23);
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionViewMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    //event listeners for buttons

    document.getElementById( "zFarSlider" ).onclick = function (event) {
        far = event.target.value;
        render();
    };
    document.getElementById( "zNearSlider" ).onclick = function (event) {
        near = event.target.value;
        render();
    };
    document.getElementById( "radiusSlider" ).onclick = function (event) {
        radius = event.target.value;
        render();
    };
    document.getElementById( "thetaSlider" ).onclick = function (event) {
        theta = event.target.value * Math.PI/180.0;
        render();
    };
    document.getElementById( "phiSlider" ).onclick = function (event) {
        phi = event.target.value * Math.PI/180.0;
        render();
    };
    document.getElementById( "aspectSlider" ).onclick = function (event) {
        aspect = event.target.value;
        render();
    };
    document.getElementById( "fovSilder" ).onclick = function (event) {
        fovy = event.target.value;
        render();
    };
    
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionViewMatrixLoc, flase, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES,0,numVerticies);
}