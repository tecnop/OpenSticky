var Entity = {
	// Static
	currZ : 2,
	entityCount : 0,
	// Constructorz
	random : function(data){
		this.randomInit(data);
	},
	fromCode : function(data){
		this.randomInit(data);
	}
}

/*
#  data : {
	context : <ThreeWrapper>,
	data : {
	
	}	
}
*/
Entity.random.prototype = {
	MAX_Z : 3000,
	Z_STEP : 0.1,
	MIN_WIDTH : 2,
	MAX_WIDTH : 32,
	MIN_HEIGHT : 2,
	MAX_HEIGHT : 32,
	MIN_SPEED : 1,
	MAX_SPEED : 25,
	MIN_DEPTH : 1,
	MAX_DEPTH : 5,
	DEFAULT_OPACITY : 0.8,
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
			width = Math.floor(Math.random() * (me.MAX_WIDTH - me.MIN_WIDTH + 1)) + me.MIN_WIDTH,
			height = Math.floor(Math.random() * (me.MAX_HEIGHT - me.MIN_HEIGHT + 1)) + me.MIN_HEIGHT;

		

		me.key = "entity" + (++Entity.entityCount);

		me.rorationFactor = Math.floor(Math.random()* 100);

		me.destination = null;

		me.size = {};
		me.size.midWidth = width <= 1 ? 2 : width - (width % 2);
		me.size.midHeight= height <= 1 ? 2 : height - (height % 2);
		me.size.width = me.size.midWidth *2;
		me.size.height = me.size.midHeight *2;

		me.speed = Math.floor(Math.random() * (me.MAX_SPEED - me.MIN_SPEED + 1)) + me.MIN_SPEED;

		me.color = new Color.float(Math.random(), Math.random(), Math.random() , me.DEFAULT_ALPHA);

		if (data && data.cube){
			me.geometry = me.defineCubeMesh()
		}
		else {
			me.geometry = me.definePlaneMesh();
		}

		var incCol = new THREE.Color(Math.random(), Math.random(), Math.random());

		//MeshBasicMaterial - MeshLambertMaterial - MeshPhongMaterial
		me.material = new THREE.MeshLambertMaterial({
			color: me.color.toHex(false), 
		});
		//me.material.emissive = new THREE.Color(0.5,0.5,0.5);
		
		me.material.transparent = true;
		me.material.opacity = me.DEFAULT_OPACITY;

		me.object = new THREE.Mesh(me.geometry, me.material);
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
		else if (me.rorationFactor < 30){
			me.actions.continuous.push(function(three) {
				me.object.rotation.z += 0.01;
			});
		}
		else if (me.rorationFactor < 40){
			me.actions.continuous.push(function(three) {
				me.object.rotation.z -= 0.01;
			});
		}

	},
	defineCubeMesh : function(){
		var me = this,
			z = Math.floor(Math.random() * (me.MAX_DEPTH - me.MIN_DEPTH + 1)) + me.MIN_DEPTH,
			geometry = new THREE.BoxGeometry(me.size.width, me.size.height, z);

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
		Entity.currZ = Entity.currZ <= this.MAX_Z ? Entity.currZ + this.Z_STEP : this.MAX_Z;
		return Entity.currZ;
	},
	setColor : function(color){
		var me = this;
		me.color = color;
		me.material.color = {
			r : me.color.r,
			g : me.color.g,
			b : me.color.b,
			a : me.color.a || 1.0
		};
	},
	add : function(vector) {
		this.object.position.x += vector.x;
		this.object.position.y += vector.y;
		this.object.position.z += vector.z;
	},
	evaluate : function(three){
		return this.color.comparate( three.getSquareColor(this, {width : this.size.width, height : this.size.height}) );
	},
	onDestinationReach : function(three){
		three.geneticsManager.add(this);
	},


}
Entity.fromCode.prototype = Entity.random.prototype;