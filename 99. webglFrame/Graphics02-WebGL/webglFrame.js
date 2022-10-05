
var gl;

window.onload= function init(){
    var canvas = document.getElementById("gl-canvas");
    gl.WebGLUtils.setupWebGL(canvas);
    if(!gl){alert("aaa");}

    gl.viewPort(0,0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vertices = [
        vec2(-1.0,-1.0),
        vec2(0.0,1.0),
        vec2(1.0,-1.0)
    ];

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0,0);
    gl.enbleVertexAttribArray(vPosition);

    var colors = gl.getUniformLocation(program, "colors");
    gl.uniform4f(colors, 1.0,1.0,0.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0 ,3);


}