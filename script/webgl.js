

var WebGL = function (container, shaderManager) {
	this.inject({container: container, shaderManager: shaderManager});
}

WebGL.prototype = {

	inject : function(data){
		var me = this;

		me.container = data.container;
		me.shaderManager = data.shaderManager;

		console.log(me.container);
		me.gl = data.container.getContext('webgl');

		if(!me.gl){
			alert("WebGL not available");
			return;
		}

		// Met la couleur d'effacement au noir et complétement opaque
		me.gl.clearColor(1.0, 1.0, 0.0, 1.0);   

		 // Active le test de profondeur                   
		me.gl.enable(me.gl.DEPTH_TEST);

		 // Les objets proches cachent les objets lointains                        
		me.gl.depthFunc(me.gl.LEQUAL);

		// Efface les couleurs et le buffer de profondeur.                    
		me.gl.clear(me.gl.COLOR_BUFFER_BIT|me.gl.DEPTH_BUFFER_BIT);   

		var vertexShader = me.shaderManager.getShader('vertex', 'default', me.gl),
			fragmentShader =  me.shaderManager.getShader('fragment', 'default', me.gl);


		var shaderProgram = me.gl.createProgram();
		me.gl.attachShader(shaderProgram, vertexShader);
		me.gl.attachShader(shaderProgram, fragmentShader);
		me.gl.linkProgram(shaderProgram);

		// Faire une alerte si le chargement du shader échoue

		if (!me.gl.getProgramParameter(shaderProgram, me.gl.LINK_STATUS)) {
			alert("Shader init fails.");
		}

		me.gl.useProgram(shaderProgram);

		vertexPositionAttribute = me.gl.getAttribLocation(shaderProgram, "aVertexPosition");
		me.gl.enableVertexAttribArray(vertexPositionAttribute);

		// DEL ME
		var squareVerticesBuffer = me.gl.createBuffer();
		me.gl.bindBuffer(me.gl.ARRAY_BUFFER, squareVerticesBuffer);

		var vertices = [
			1.0,  1.0,  0.0,
			-1.0, 1.0,  0.0,
			1.0,  -1.0, 0.0,
			-1.0, -1.0, 0.0
		];

		me.gl.bufferData(me.gl.ARRAY_BUFFER, new Float32Array(vertices), me.gl.STATIC_DRAW);

		me.gl.clear(me.gl.COLOR_BUFFER_BIT | me.gl.DEPTH_BUFFER_BIT);
		me.gl.bindBuffer(me.gl.ARRAY_BUFFER, squareVerticesBuffer);
		me.gl.vertexAttribPointer(vertexPositionAttribute, 3, me.gl.FLOAT, false, 0, 0);
		//setMatrixUniforms();
		me.gl.drawArrays(me.gl.TRIANGLE_STRIP, 0, 4);
		//me.drawScene(squareVerticesBuffer);

	},
	drawScene : function (squareVerticesBuffer) {
		var me = this;

		

		/*
		var perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

		loadIdentity();// ?
		mvTranslate([-0.0, 0.0, -6.0]);// ?

		me.gl.bindBuffer(me.gl.ARRAY_BUFFER, squareVerticesBuffer);
		me.gl.vertexAttribPointer(vertexPositionAttribute, 3, me.gl.FLOAT, false, 0, 0);

		setMatrixUniforms(); // ?

		me.gl.drawArrays(me.gl.TRIANGLE_STRIP, 0, 4);
		*/
	},
	loadIdentity : function () {
		mvMatrix = Matrix.I(4);
	},
 	multMatrix : function(m) {
		mvMatrix = mvMatrix.x(m);
	},
	mvTranslate : function(v) {
		multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
	},
	setMatrixUniforms : function () {
		var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
	},
	initOpenGL : function(){
		var me = this;

	}

}