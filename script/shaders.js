
var ShadersManager = {

	init : function (){
		var me = this;

		/*
		for(var i = 0, len = me.shadersTemplates.vertex.length; i < len; i ++){
			me.av		
		}
		*/
	},
	// Type <enum> vertex || fragment
	get : function(type, name){
		
	},
	getShader : function(type, name, gl) {
		var me = this,
			shader,
			source;

		if(!me.shadersTemplates[type]){
			alert("Shader of type '" + type + "' doesnt exists.");
			return null;
		}
		else if (!me.shadersTemplates[type][name]){
			alert("Shader with name '" + name + "' doesnt exists.");
			return null;
		}

		source = me.shadersTemplates[type][name].join('');

		if(type === 'vertex'){
			shader = gl.createShader(gl.VERTEX_SHADER);
		}else if (type === 'fragment'){
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		}

		gl.shaderSource(shader, source);

		gl.compileShader(shader);  
    
		// Vérifie si la compilation s'est bien déroulée
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
			alert("Shader compile fails : " + gl.getShaderInfoLog(shader));
			return null;  
		}
    
  		return shader;
	},
	availableShaders : {},
	shadersTemplates : {
		vertex : {
			default : [
				'attribute vec3 aVertexPosition;',

				'uniform mat4 uMVMatrix;',
				'uniform mat4 uPMatrix;',
				'void main(void) {',

					'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
				'}'
			],
			
		},
		fragment : {
			default : [
				'void main(void) {',
					'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
				'}'
			]

		}
	}
}

