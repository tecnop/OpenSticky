var Entity = {
	// Static
	currZ : 2,
	entityCount : 0,
	// Constructorz
	squared : function(data){
		this.init(data);
	},
	
}


Entity.squared.prototype = {

	init : function(data){
		var me = this;

		//this.memory = new Memory();

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
			}),
			phong : new THREE.MeshPhongMaterial({
				color : data.color
			})

		}

		this.currentMaterial = 'default';

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
					material : this.materials[this.currentMaterial],
					width : this.squareWidth,
					height : this.squareHeight,
					depth : this.depth,
					startX : currX,
					startY : currY,
					matrixPosition : Math.pow(2, i),
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
	removeSquares : function(count, three){
		if (this.childs.length <= 1){
			return;
		}

		var toDelete = [],
			next = this.childs.pop();

		while (next) {
			toDelete.push(next);
			
			this.matrix.intMatrix = this.matrix.intMatrix ^ next.matrixPosition;
			

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
	toggleVisible : function (){
		for (var i = 0, len = this.childs.length; i < len; ++i){
			this.childs[i].object.visible = !this.childs[i].object.visible;
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
		this.materials[this.currentMaterial].color = col;
	},
	calculateFitness : function(three){
		var res = 0;

		for (var i = 0, len = this.childs.length; i < len; ++i){
			var slot = three.grid.getSlotByMap(this.childs[i].object.position.x, this.childs[i].object.position.y);

			if(slot && !slot.locked)
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
	/* Mutate */
	randomMutate : function(add){

	},
	mutateLess : function(){
		if(this.childs.length <= 1){
			return;
		}


		// TODO
	},
	mutateMore : function(){

		if(this.childs.length >= (this.matrix.col * this.matrix.row)){
			return;
		}

		// TODO
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
	/*
	# Generalz Events
	*/
	onDestinationReach : function(three, destination) {

		
		if (this.onValidation) {

			this.onValidation = false;


			if (this.calculateFitness(three).percent >= 100){
				
				three.grid.validateEntityByMap(this);

				this.posed = true;

				var col = three.getSquareColor(this, {width : this.squareWidth, height : this.squareHeight});
					
				if(col){
					this.setColor(col);
				}

				three.entitiesManager.remove(this);
				three.grid.validatedEntities.push(this);
				three.grid.removeByMap(this, true);
			}
			else {
				//console.log("too late .. Curr : ", this.object.position , " Des : ", this.oldPosition, " Distance : ", this.oldPosition.distanceTo(this.object.position));
				
				this.destination = new THREE.Vector3(1,1,1);
				this.destination.copy(this.oldPosition);

				//three.grid.addByMap(this, false);
			}

		}
		else {
			var slot = three.grid.getSlotByMap(this.head.object.position.x, this.head.object.position.y);

			if (slot.locked) {
				//var inc = three.grid.getRandomSlotInRect(slot.i - 7, slot.i + 7, slot.j - 7, slot.j + 7);
				
				//var inc = three.grid.tryGetRandomFreeSlotInRect(slot.i - 10, slot.i + 10, slot.j - 10, slot.j + 10);

				var inc = three.grid.getRandomSlot();

				this.destination = new THREE.Vector3(inc.threeX, inc.threeY, this.head.object.position.z);
				return;
			}

			//three.grid.addSquaredEntityByCoor(this, false);
			three.grid.addByMap(this, false);
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

		this.matrixPosition = data.matrixPosition;
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

 
var Memory = function(data){
	this.init(data);
}

Memory.prototype = {
	init : function(data) {
		this.lockedPositionMap = {};
	},
	buildKey : function(vector){
		return vector.x + '_' + vector.y;
	},
	addPosition : function(vector){
		var k = this.buildKey(vector);

		if(this.lockedPositionMap[k])
			return;

		this.lockedPositionMap[k] = true;
	},
	hasPosition : function(vector){
		var k = this.buildKey(vector);

		return this.lockedPositionMap[k] || false;
	},

}