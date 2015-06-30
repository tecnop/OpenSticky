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

		//MeshBasicMaterial - MeshLambertMaterial - MeshPhongMaterial
		me.material = new THREE.MeshBasicMaterial({
			color: me.color.getHex(),
		});
		
		/*me.material = new THREE.ShaderMaterial( {
		    vertexShader:  document.getElementById('vertexShader1'),
		    fragmentShader: document.getElementById('fragmentShader1')
		});
*/
		me.material.emissive = new THREE.Color(0,0,0);
		
		me.material.transparent = true;
		me.material.opacity = Math.floor(Math.random() * (Entity.random.MAX_OPACITY - Entity.random.MIN_OPACITY + 1)) + Entity.random.MIN_OPACITY;

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

	},
	defineCubeMesh : function(){
		var me = this,
			z = Math.floor(Math.random() * (Entity.random.MAX_DEPTH - Entity.random.MIN_DEPTH + 1)) + Entity.random.MIN_DEPTH,
			geometry = new THREE.BoxGeometry(me.size.width, me.size.height, z);

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
		me.color = color;
		me.material.color.copy(color);
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

Entity.defined.prototype = {

}

Entity.squared.prototype = {

	init : function(data){
		var me = this;

		this.onValidation = false;
		this.posed = false;

		this.key = "entity" + (++Entity.entityCount);

		this.depth = data.depth;
		this.squareWidth = data.squareWidth;
		this.squareHeight = data.squareHeight;

		this.size = {
			width : this.squareWidth,
			height :  this.squareHeight
		};

		this.speed = data.speed;

		this.matrix = data.matrix;

		this.childs = [];
		this.head = null;

		this.actions = {
			continuous : []
		}

		this.color = data.color;
		this.opacity = data.opacity || 1.0;

		this.materials = {
			default : new THREE.MeshLambertMaterial({
				color: data.color
			}),
			basic : new THREE.MeshBasicMaterial({
				color : data.color
			})

		}
		this.materials.default.transparent = data.opacity ? true : false;
		this.materials.default.opacity = this.opacity;

		this.buildSquares(this.matrix.intMatrix, this.matrix.col, this.matrix.row);

		/*this.actions.continuous.push(function(three) {
			for (var i = 0, len = me.childs.length; i < len; ++i){
				me.childs[i].object.rotation.z += 0.02;
			}
		});*/

		this.head = this.childs[0];
		this.head.isHead = true;
		if(data.headColor){
			this.head.object.material = new THREE.MeshBasicMaterial({
				color : data.headColor
			});
		}
		
		this.object = this.head.object;

	},
	/* matrix size must be the exact matrix size (ex : 16 for 4*4 matrix) */
	buildSquares : function(intMatrix, col, row){
		
		var currX = 0,
			currY = 0,
			currCol = 0;

		for (var i = 0; i < row * col; ++i){
			
			/*console.log(" LOGICAL AND : "  +  (intMatrix & Math.pow(2, i)) );*/

			if ( (intMatrix & Math.pow(2, i)) != 0){
				/*console.log(" MATCH "  + i + " ? currX : " + currX + "; currY : " + currY);*/

				//var vec =  new THREE.Vector3(currX,currY,0);

				this.childs.push(new EntitySquare({
					owner : this,
					material : this.materials.basic,
					width : this.squareWidth,
					height : this.squareHeight,
					depth : this.depth,
					startX : currX,
					startY : currY,
					position : new THREE.Vector3(
						currX,
						currY,
						0
					),
				}));
			}

			currX += this.squareHeight;

			if (++currCol >= col){
				currX = 0;
				currY += this.squareWidth;
				currCol = 0;
			}
		}
	},
	pushIntoScene : function(scene){
		for (var i = 0, len = this.childs.length; i < len; ++i){
			scene.add(this.childs[i].object);
		}
	},
	removeFromScene : function (scene){
		for (var i = 0, len = this.childs.length; i < len; ++i){
			scene.remove(this.childs[i].object);
		}
	},
	removeSquares : function(count){
		if (this.childs.length <= 1){
			return;
		}

		var toDelete = [],
			next = this.childs.pop();

		while (next){
			toDelete.push(next);

			if(--count <= 0)
				break;

			next = this.childs[this.childs.length-1].isHead ? null : this.childs.pop();
		}

		return toDelete;
	},
	add : function(vector){
		for (var i = 0, len = this.childs.length; i < len; ++i){
			this.childs[i].add(vector);
		}
	},
	getPosition : function(){
		return this.head.object.position;
	},
	setPosition : function(vector){

		for (var i = 0, len = this.childs.length; i < len; ++i){
			if( this.childs[i].isHead){

				this.childs[i].object.position.copy(vector);

			} else {
				var diff = new THREE.Vector3(0,0,0);

				diff = diff.subVectors(this.childs[i].startVector , this.head.startVector);

				this.childs[i].object.position.copy(vector).add(diff);
				
			}
				
		}

	},
	setColor : function(col){
		this.materials.basic.color = col;
	},
	calculateFitness : function(three){
		var res = 0;

		for (var i = 0, len = this.childs.length; i < len; ++i){
			var slot = three.grid.getSlotByCoor(this.childs[i].object.position.x, this.childs[i].object.position.y);

			if(slot && slot.state == 0)
				++res;
		}

		return {
			match : res,
			length : this.childs.length,
			percent : parseInt(res * 100 / this.childs.length)
		};
	},
	/* Crosses */
	randomCross : function (entity){
		var rdm = Math.floor(Math.random() * 100);

		if (rdm <= 50){
			return this.crossAND(entity);
		}
		else if (rdm <= 100){
			return this.crossXOR(entity);
		}
		else {
			return this.crossOR(entity);
		}
	},
	crossAND : function (entity) {
		var incMatrix = this.matrix.intMatrix & entity.matrix.intMatrix;

		if(0 == incMatrix){
			return null;
		}

		return new Entity.squared({
			speed : parseInt( (this.speed + entity.speed) / 2),
			depth : parseInt( (this.depth + entity.depth) / 2),
			squareWidth : this.squareWidth,
			squareHeight : this.squareHeight,
			color : new THREE.Color(
				(this.color.r + entity.color.r ) / 2,
				(this.color.g + entity.color.g ) / 2,
				(this.color.b + entity.color.b ) / 2
			),
			opacity : (this.opacity + entity.opacity) / 2,
			matrix : {
				col : this.matrix.col,
				row : this.matrix.row,
				intMatrix : incMatrix,
			}
		});
	},
	crossOR : function (entity) {
		var incMatrix = this.matrix.intMatrix |  entity.matrix.intMatrix;

		if(0 == incMatrix){
			return null;
		}

		return new Entity.squared({
			speed : parseInt( (this.speed + entity.speed) / 2),
			depth : parseInt( (this.depth + entity.depth) / 2),
			squareWidth : this.squareWidth,
			squareHeight : this.squareHeight,
			color : new THREE.Color(
				(this.color.r + entity.color.r ) / 2,
				(this.color.g + entity.color.g ) / 2,
				(this.color.b + entity.color.b ) / 2
			),
			opacity : (this.opacity + entity.opacity) / 2,
			matrix : {
				col : this.matrix.col,
				row : this.matrix.row,
				intMatrix : incMatrix,
			}
		});
	},
	crossXOR : function (entity) {
		var incMatrix = this.matrix.intMatrix ^ entity.matrix.intMatrix;

		if(0 == incMatrix){
			return null;
		}

		return new Entity.squared({
			speed : parseInt( (this.speed + entity.speed) / 2),
			depth : parseInt( (this.depth + entity.depth) / 2),
			squareWidth : this.squareWidth,
			squareHeight : this.squareHeight,
			color : new THREE.Color(
				(this.color.r + entity.color.r ) / 2,
				(this.color.g + entity.color.g ) / 2,
				(this.color.b + entity.color.b ) / 2
			),
			opacity : (this.opacity + entity.opacity) / 2,
			matrix : {
				col : this.matrix.col,
				row : this.matrix.row,
				intMatrix : incMatrix,
			}
		});
	},
	randomMutate : function(add){

	},
	/* Mutates */
	mutateSpecial2 : function (){
		
		return new Entity.squared({
			speed : this.speed,
			depth : this.depth,
			squareWidth : this.squareWidth, 
			squareHeight : this.squareHeight,
			color : this.color,
			opacity : this.opacity,
			matrix : {
				col : this.matrix.col,
				row : this.matrix.row,
				intMatrix : this.matrix.intMatrix & Datas.special2,
			}
		});

		
	},
	onDestinationReach : function(three, destination) {

		
		if (this.onValidation) {

			this.onValidation = false;

			console.log("onValidation fitness : ", this.calculateFitness(three));

			if (this.calculateFitness(three).percent >= 100){
				
				three.grid.validateEntity(this);

				this.posed = true;

				var col = three.getSquareColor(this, {width : this.squareWidth, height : this.squareHeight});
					
				if(col){
					this.setColor(col);
				}

				//three.entitiesManager.remove(this);
			}
			else {
				console.log("too late .. Curr : ", this.object.position , " Des : ", this.oldPosition, " Distance : ", this.oldPosition.distanceTo(this.object.position));
				this.destination = new THREE.Vector3(	this.oldPosition.x,
														this.oldPosition.y,
														this.oldPosition.z
													);

				//three.grid.addSquaredEntityByCoor(this, false);
			}

		}
		else {
			three.grid.addSquaredEntityByCoor(this, false);
		}
		
	}
}


var EntitySquare = function(data){
	this.init(data);
}

EntitySquare.prototype = {
	init : function(data){
		
		this.owner = data.owner;

		this.object = new THREE.Mesh(
			new THREE.BoxGeometry(data.width, data.height, data.depth), 
			data.material
		);

		
		this.startX = data.startX;
		this.startY = data.startY;		

		this.startVector = new THREE.Vector3(data.startX, data.startY, 0);

		this.object.position.x = data.position.x;
		this.object.position.y = data.position.y;
		this.object.position.z = data.position.z;
		//console.log("Pos :: (" + this.object.position.x + ", " + this.object.position.y + ", " + this.object.position.z +")");

	},
	add : function(vector){
		this.object.position.add(vector);
	}
}

