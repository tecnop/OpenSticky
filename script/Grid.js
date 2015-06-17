var Grid = function (data){
	this.init(data);
}

/*
# Data
	step <int>,
	imagePlaneWrapper {
		width <int>,
		heught <int>,
		imagePlane <Mesh>,
		rect {
			topLeft : {
				x : -( parseInt(hiddenCanvas.img.width/2) ),
				y : ( parseInt(hiddenCanvas.img.height/2) ),
			},
			bottomRight : {
				x : ( parseInt(hiddenCanvas.img.width/2) ),
				y : -( parseInt(hiddenCanvas.img.height/2) ),
			}
		}
	},

*/
Grid.prototype = {
	BASE_VECTOR : new THREE.Vector3(0,0,0),
	LOG : false,
	init : function(data){

		this.step = data.step;
		this.width = data.imagePlaneWrapper.rect.width;
		this.height = data.imagePlaneWrapper.rect.height;

		this.startX = data.imagePlaneWrapper.rect.topLeft.x - ( data.imagePlaneWrapper.rect.topLeft.x % this.step);
		this.startY = data.imagePlaneWrapper.rect.topLeft.y - ( data.imagePlaneWrapper.rect.topLeft.y % this.step);


		var w = (this.width - (this.width % this.step)) / this.step,
			h = (this.height - (this.height % this.step)) / this.step,
			currX = this.startX,
			/*Poulet au*/ currY = this.startY;

		this.grid = [];
		this.maxWidth = this.width - (this.width % this.step);
		this.maxHeight = this.height - (this.height % this.step);

		this.maxWidthIndex = w -1;
		this.maxHeightIndex = h -1;

		//console.log(" w : " + w + " h : " + h + " step : " + this.step);

		//var lineMsg = "";
		this.expectedCases = 0;
		this.entitiesCases = 0;

		for (var i = 0; i < w; ++i) {
			this.grid.push([]);


			//lineMsg += "[" 
			for (var j = 0; j < h; ++j) {
				this.grid[i].push(new GridSlot({
					threeX : currX,
					threeY : currY,
				}));


				//lineMsg += "# x : " + currX + ", y : " + currY + " #";

				currX += this.step;
				++this.expectedCases;
			}

			//lineMsg += "]\n" 

			currX = this.startX;
			currY -= this.step;
		}
		//console.log(lineMsg);

	},
	clipCoor : function (vector){
		vector.x = vector.x - (vector.x % this.step);
		vector.y = vector.y - (vector.y % this.step);
	},
	coorToIndex : function(x, y){
		x = Math.abs( (x - (x % this.step)) + this.startX );
		y = Math.abs( (y - (y % this.step)) + this.startY );
	/*	console.log("coorToIndex :: x  : " + x + " y : " + y);
		console.log("coorToIndex :: i  : " + x/ this.step + " j : " + y/ this.step);*/
		return {i : x / this.step, j : y / this.step};
	},
	/* Actions */
	// Add
	addSquaredEntityByCoor : function(entity, definitive){
		var coor = this.coorToIndex(entity.head.object.position.x, entity.head.object.position.y);

		this.addSquaredEntityByIndex(entity, coor.i, coor.j,definitive);
	},
	addSquaredEntityByIndex : function(entity, i , j, definitive){
		if ( i < 0 || i > this.maxWidthIndex ||
			 j < 0 || j > this.maxHeightIndex) {
			if(LOG)
				console.warn("Cannot *add* entity. i : " + i + " j : " + j);
			return;
		}

		if(definitive)
			this.entitiesCases += entity.childs.length;

		this.grid[i][j].addEntity(entity.head);

		/*for (var cpt = 0, len = entity.childs.length; cpt < len; ++cpt){

		}*/
	},
	// Remove
	removeSquaredEntityByCoor : function (entity, definitive){
		var coor = this.coorToIndex(entity.head.object.position.x, entity.head.object.position.y);

		this.removeSquaredEntityByIndex(entity, coor.i, coor.j, definitive);
	},
	removeSquaredEntityByIndex : function(entity, i , j , definitive){
		if ( i < 0 || i > this.maxWidthIndex ||
			 j < 0 || j > this.maxHeightIndex) {
			if(this.LOG)
				console.warn("Cannot *remove* entity. i : " + i + " j : " + j);
			return;
		}

		if(definitive)
			this.entitiesCases -= entity.childs.length;

		this.grid[i][j].removeEntity(entity);
	},
	// Get
	getSlotByCoor : function (x, y){
		var coor = this.coorToIndex(x, y);

		return this.getSlotByIndex(coor.i, coor.j);
	},
	getSlotByIndex : function(i , j){
		if ( i < 0 || i > this.maxWidthIndex ||
			 j < 0 || j > this.maxHeightIndex) {
			if(this.LOG)
				console.warn("Cannot *get* entity. i : " + i + " j : " + j);
			return null;
		}

		return this.grid[i][j];
	},
	getHeadsInRect : function (sI, eI, sJ, eJ){
		if ( sI < 0 || sI > this.maxWidthIndex ||
			 eI < 0 || eI > this.maxWidthIndex ||
			 sJ < 0 || sJ > this.maxHeightIndex  ||
			 eJ < 0 || eJ > this.maxHeightIndex) {
			if(this.LOG)
				console.warn("Cannot *get* slots. start i : " + sI + " start j : " + sJ);
			return null;
		}

		var res = [];

		for (var i = sI; i < eI; ++i) {
			for (var j = sJ; j < eJ; ++j) {

				if(this.grid[i][j].entities.length > 0) {
					for (var k = 0, len = this.grid[i][j].entities.length; k < len; ++k)
						res.push(this.grid[i][j].entities[k]);
				}
			}
		}
		return res;

	},
	getEntitiesInRect : function (sI, eI, sJ, eJ){
		if ( sI < 0 || sI > this.maxWidthIndex ||
			 eI < 0 || eI > this.maxWidthIndex ||
			 sJ < 0 || sJ > this.maxHeightIndex  ||
			 eJ < 0 || eJ > this.maxHeightIndex) {
			if(this.LOG)
				console.warn("Cannot *get* slots. start i : " + sI + " start j : " + sJ);
			return null;
		}

		var res = [];

		for (var i = sI; i < eI; ++i) {
			for (var j = sJ; j < eJ; ++j) {

				if(this.grid[i][j].entities.length > 0) {
					for (var k = 0, len = this.grid[i][j].entities.length; k < len; ++k)
						res.push(this.grid[i][j].entities[k].owner);
				}
			}
		}
		return res;

	},
	// Random
	getRandomSlot : function(){
		var rI = Math.floor(Math.random() * this.grid.length);
			//choosenOne = this.grid[rI][ Math.floor(Math.random() * this.grid[rI].length) ];

		return this.grid[rI][ Math.floor(Math.random() * this.grid[rI].length) ];
	},

}

var GridSlot = function(data){
	this.init(data);
}
/*
# Data :
	state <enum>
		0 : empty
		1 : pending : entity is moving to this slot
		2 : occupied
*/
GridSlot.prototype = {
	init : function(data){
		this.threeX = data.threeX;
		this.threeY = data.threeY;
		this.entities = [];
		this.state = 0;
		

	},
	addEntity : function(entitySquare){
		this.entities.push(entitySquare);
	},
	removeEntity : function(entitySquare){
		if (this.entities.length == 1){
			this.entities.pop();
		}
		else {
			var newEntities = [];

			for (var i = 0; i < this.entities.length; ++i){
				if (this.entities[i].key != entitySquare.key){
					newEntities.push(this.entities[i]);
				}
			}
			this.entities = newEntities;
		}
	},
	setPending : function(entitySquare){

	}
}
