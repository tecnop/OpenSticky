var Entity = {
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
	MAX_Z : 15,
	MIN_WIDTH : 4,
	MAX_WIDTH : 26,
	MIN_HEIGHT : 4,
	MAX_HEIGHT : 26,
	currZ : 2,
	actions : [],
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
	randomInit : function(data){
		var me = this,
			width = Math.floor(Math.random() * (me.MAX_WIDTH - me.MIN_WIDTH + 1)) + me.MIN_WIDTH,
			height = Math.floor(Math.random() * (me.MAX_HEIGHT - me.MIN_HEIGHT + 1)) + me.MIN_HEIGHT;

		me.size.midWidth = width - (width % 2);
		me.size.midHeight= height - (height % 2);
		me.size.width = me.size.midWidth *2;
		me.size.height = me.size.midHeight *2;

		me.color = new Color.float(Math.random(), Math.random(), Math.random() );

		//var vertices = Math.floor((Math.random()*(data.targets.length)));
		//me.meshType = getRandomMesh();

		me.geometry = me.definePlaneMesh();

		me.material = new THREE.MeshBasicMaterial({
			color: me.color.toHex(false), 
			side: THREE.DoubleSide
		});


		me.object = new THREE.Mesh(me.geometry, me.material);
		me.object.position.z = me.getNextZ();

		me.actions.push(function(three){
			return three.getPixelColor(me.object.position);
		});
		me.actions.push(function(three){
			return three.getSquareColor(me, {width : me.size.width, height : me.size.height});
		});

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

		geometry.computeBoundingSphere();

		return geometry;
	},
	getNextZ : function(){
		return this.currZ <= this.MAX_Z ? this.currZ+=0.1 : this.MAX_Z;
	},
	setColor : function(color){
		var me = this;
		me.color = color;
		me.material.color = {
			r : me.color.r, 
			g : me.color.g,
			b : me.color.b
		};
	},
	add : function(vector){
		this.object.position.x += vector.x;
		this.object.position.y += vector.y;
		this.object.position.z += vector.z;
	},
	init : function(data){
		var me = this;
	},

}
Entity.fromCode.prototype = Entity.random.prototype;