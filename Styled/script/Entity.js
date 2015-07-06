var Entity = {
	// Static
	currZ : 2,
	entityCount : 0,
	// Constructorz
	random : {
		MAX_Z : 3000,
		MIN_Z_STEP : 0.3,
		MAX_Z_STEP : 0.5,
		MIN_WIDTH : 2,
		MAX_WIDTH : 64,
		MIN_HEIGHT : 2,
		MAX_HEIGHT : 64,
		MIN_SPEED : 1,
		MAX_SPEED : 25,
		MIN_DEPTH : 2,
		MAX_DEPTH : 14,
		MIN_OPACITY : 0.5,
		MAX_OPACITY : 0.8,
		constructor : function(data){
			this.randomInit(data);
		},
		defineRandomValues : function(data){
			for (var k in data){
				if (this[k]){
					this[k] = data[k]; 
				}
			}
		}
	},
	defined : function(data){
		this.init(data);
	},
	squared : function(data){
		this.init(data);
	},
	
}

Entity.random.constructor.prototype = {
	/*MAX_Z : 3000,
	MIN_Z_STEP : 0.3,
	MAX_Z_STEP : 0.5,
	MIN_WIDTH : 2,
	MAX_WIDTH : 64,
	MIN_HEIGHT : 2,
	MAX_HEIGHT : 64,
	MIN_SPEED : 1,
	MAX_SPEED : 25,
	MIN_DEPTH : 5,
	MAX_DEPTH : 25,
	MIN_OPACITY : 0.5,
	MAX_OPACITY : 0.8,*/
	/*
	key : "entity",
	actions : {
		continuous : [],
		rules : {},
	},
	color : null,
	geometry : null,
	material : null,
	object : null,
	size : {
		width : 0,
		height : 0,
		midWidth : 0,
		midHeight : 0
	},
	*/
	randomInit : function(data){

		var me = this,
			width = Math.floor(Math.random() * (Entity.random.MAX_WIDTH - Entity.random.MIN_WIDTH + 1)) + Entity.random.MIN_WIDTH,
			height = Math.floor(Math.random() * (Entity.random.MAX_HEIGHT - Entity.random.MIN_HEIGHT + 1)) + Entity.random.MIN_HEIGHT;

		

		me.key = "entity" + (++Entity.entityCount);

		me.rorationFactor = Math.floor(Math.random()* 100);
		me.opacityFactor = Math.floor(Math.random()* 100);


		me.destination = null;

		me.size = {};
		me.size.midWidth = width <= 1 ? 2 : width - (width % 2);
		me.size.midHeight= height <= 1 ? 2 : height - (height % 2);
		me.size.width = me.size.midWidth *2;
		me.size.height = me.size.midHeight *2;

		me.speed = Math.floor(Math.random() * (Entity.random.MAX_SPEED - Entity.random.MIN_SPEED + 1)) + Entity.random.MIN_SPEED;

		me.color = new THREE.Color(Math.random(), Math.random(), Math.random());

		if (data.cube){

			me.geometry = me.defineCubeMesh()

		}
		else if (data.sphere) {
			me.geometry = me.defineSphereMesh()
		}
		else {
			me.geometry = me.definePlaneMesh();
		}

		var incCol = new THREE.Color(Math.random(), Math.random(), Math.random());


		/* Default THREE shader

		//MeshBasicMaterial - MeshLambertMaterial - MeshPhongMaterial
		me.material = new THREE.MeshBasicMaterial({
			color: me.color.getHex(),
		});
		//*/

    var attributes = {
		displacement: {
			type: 'f', // a float
			value: [] // an empty array
		}		
	};
	
	this.uniforms = {
		amplitude: {
			type: 'f', // a float
			value: 0
		},
		shadColor: {
			type: 'c', value: []
		},
		time: {
			type: 'f', value: 1.0
		}
	};



		
		//* Custom (htexml inline shaderz) shaders (vertex + fragment)
		me.material = new THREE.ShaderMaterial( {
			uniforms:     	this.uniforms,
			attributes:     attributes,
		    vertexShader:  document.getElementById('vertexShader1').text,
		    fragmentShader: document.getElementById('fragmentShader1').text
		});
		//*/

		me.uniforms.shadColor.value = new THREE.Color(Math.random() * 1.0,Math.random() * 1.0,Math.random() * 1.0);
	// create a new mesh with geometry -
	// we will cover the sphereMaterial next!
	me.object = new THREE.Mesh(me.geometry, me.material);

	var vertices = me.geometry.vertices;
	var values = attributes.displacement.value
	for(var v = 0; v < vertices.length; v++) {
		values.push(Math.random() * 15);
	}


		//me.material.emissive = new THREE.Color(0,0,0);
		
		//me.material.transparent = true;
		//me.material.opacity = Math.floor(Math.random() * (Entity.random.MAX_OPACITY - Entity.random.MIN_OPACITY + 1)) + Entity.random.MIN_OPACITY;

		//me.object = new THREE.Mesh(me.geometry, me.material);
		




		me.object.position.z = me.getNextZ();
		me.actions = {};
		me.actions.rules = {};
		me.actions.continuous = [];

		me.actions.rules.getpixel = function(three){
			return three.getPixelColor(me.object.position);
		};
		me.actions.rules.getsquare = function(three){
			return three.getSquareColor(me, {width : me.size.width, height : me.size.height});
		};

		/*
		me.up = true;

		if (me.opacityFactor < 15) { 
			me.actions.continuous.push(function(three) {
				if (me.up) {
					me.material.opacity += 0.01;
				}
				else{
					me.material.opacity -= 0.01;
				}

				if(me.material.opacity >= 0.99){
					me.up = false;
				}
				else if (me.material.opacity <= 0.10){
					me.up = true;
				}
			});
		}
		else if (me.opacityFactor < 35) { 
			me.actions.continuous.push(function(three) {
				if (me.up) {
					me.material.opacity += 0.02;
				}
				else{
					me.material.opacity -= 0.01;
				}

				if(me.material.opacity >= 0.99){
					me.up = false;
				}
				else if (me.material.opacity <= 0.30){
					me.up = true;
				}
			});
		}
		else if (me.opacityFactor < 60) {
			me.actions.continuous.push(function(three) {
				if (me.up) {
					me.material.opacity += 0.02;
				}
				else{
					me.material.opacity -= 0.02;
				}

				if(me.material.opacity >= 0.80){
					me.up = false;
				}
				else if (me.material.opacity <= 0.15){
					me.up = true;
				}
			});
		}
		else if (me.opacityFactor < 80){
			me.actions.continuous.push(function(three) {
				if (me.up) {
					me.material.opacity += 0.015;
				}
				else{
					me.material.opacity -= 0.005;
				}

				if(me.material.opacity >= 0.99){
					me.up = false;
				}
				else if (me.material.opacity <= 0.05){
					me.up = true;
				}
			});
		}
		else if (me.opacityFactor < 100){
			me.actions.continuous.push(function(three) {
				if (me.up) {
					me.material.opacity += 0.03;
				}
				else{
					me.material.opacity -= 0.03;
				}

				if(me.material.opacity >= 0.99){
					me.up = false;
				}
				else if (me.material.opacity <= 0.05){
					me.up = true;
				}
			});
		}
		//*/




		//* Rotations
		if(me.rorationFactor < 10){
			me.actions.continuous.push(function(three) {
				me.object.rotation.z += 0.03;
			});
		}
		else if (me.rorationFactor < 20){
			me.actions.continuous.push(function(three) {
				me.object.rotation.z -= 0.03;
			});
		}
		else if (me.rorationFactor < 35){
			me.actions.continuous.push(function(three) {
				me.object.rotation.z += 0.01;
			});
		}
		else if (me.rorationFactor < 50){
			me.actions.continuous.push(function(three) {
				me.object.rotation.z -= 0.01;
			});
		}
		//*/
	},
	defineCubeMesh : function(){
		var me = this,
			z = Math.floor(Math.random() * (Entity.random.MAX_DEPTH - Entity.random.MIN_DEPTH + 1)) + Entity.random.MIN_DEPTH,
			geometry = new THREE.BoxGeometry(me.size.width, me.size.height, z);
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
					//geometry.computeBoundingSphere();

		return geometry;
	},
	defineSphereMesh: function(){
		var me = this,
			z = Math.floor(Math.random() * (Entity.random.MAX_DEPTH - Entity.random.MIN_DEPTH + 1)) + Entity.random.MIN_DEPTH,
			geometry = new THREE.SphereGeometry(z, 32,32);

		//geometry.computeBoundingSphere();
		return geometry;
		
	},
	definePlaneMesh : function(){
		var me = this,
			geometry = new THREE.Geometry();

		geometry.vertices.push(
			new THREE.Vector3( -(me.size.midWidth),  (me.size.midHeight), 0 ),
			new THREE.Vector3( -(me.size.midWidth), -(me.size.midHeight), 0 ),
			new THREE.Vector3(  (me.size.midWidth), -(me.size.midHeight), 0 ),
			new THREE.Vector3(  (me.size.midWidth),  (me.size.midHeight), 0 )
		);

		geometry.faces.push( new THREE.Face3( 0, 1, 2) );
		geometry.faces.push( new THREE.Face3( 2, 3, 0) );

		//geometry.computeBoundingSphere();

		return geometry;
	},
	getNextZ : function(){
		var nextZ = Math.floor(Math.random() * (Entity.random.MAX_Z_STEP - Entity.random.MIN_Z_STEP + 1)) + Entity.random.MIN_Z_STEP;

		Entity.currZ = Entity.currZ <= Entity.random.MAX_Z ? Entity.currZ + nextZ : Entity.random.MAX_Z;
		return Entity.currZ;
	},
	setColor : function(color){
		var me = this;
		//me.color = color;
		me.uniforms.shadColor.value = color;
		//me.material.color.copy(color);
	},
	getPosition : function(){
		return this.object.position;
	},
	setPosition : function(vec){
		this.object.position = vec;
	},
	add : function(vec) {
		this.object.position.add(vec);
	},
	onDestinationReach : function(three){
		three.geneticsManager.add(this);
	},

}
