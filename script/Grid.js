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
	DEBUG_MODE : true,
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

		this.maxHeightIndex = h -1;
		this.maxWidthIndex = w -1;
		

		console.log(" w : " + w + " h : " + h + " step : " + this.step);

		//var lineMsg = "";
		this.expectedCases = 0;
		this.entitiesCases = 0;

		for (var i = 0; i < h; ++i) {
			this.grid.push([]);


			//lineMsg += "[" 
			for (var j = 0; j < w; ++j) {
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
		return new THREE.Vector3( 
			parseInt(vector.x) - ( parseInt(vector.x) % this.step),
			parseInt(vector.y) - ( parseInt(vector.y) % this.step),
			vector.z
		);

		vector.x = vector.x - (vector.x % this.step);
		vector.y = vector.y - (vector.y % this.step);
	},
	coorToIndex : function(x, y){

		x = (x - (x % this.step)) - (this.startX) ;
		y = (y - (y % this.step)) - (this.startY) ;

		var incX = x == 0 ? 0 : x / this.step,
			incY = y == 0 ? 0 : y / this.step;

		return {i : Math.abs(incY) ,j : Math.abs(incX)};

		/*
		x = (x - (x % this.step)) + this.startX ;
		y = (y - (y % this.step)) + this.startY ;

		//console.log("coorToIndex :: x  : " + x + " y : " + y);
		//console.log("coorToIndex :: i  : " + x/ this.step + " j : " + y/ this.step);
		return {i : (-1*x) / this.step, j : y / this.step};
		*/
	},
	/* 
	# Actions 
	*/
	// Add
	addSquaredEntityByCoor : function(entity, definitive){
		var coor = this.coorToIndex(entity.head.object.position.x, entity.head.object.position.y);

		this.addSquaredEntityByIndex(entity, coor.i, coor.j,definitive);
	},
	addSquaredEntityByIndex : function(entity, i , j, definitive){
		if ( i < 0 || i > this.maxWidthIndex ||
			 j < 0 || j > this.maxHeightIndex) {
			if(this.LOG)
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
	getEntitiesInRectAdvanced : function (sI, eI, sJ, eJ, sourceEntity){

		sI = sI < 0 ? 0 : sI > this.maxWidthIndex ? this.maxWidthIndex : sI;
		eI = eI < 0 ? 0 : eI > this.maxWidthIndex ? this.maxWidthIndex : eI;

		sJ = sJ < 0 ? 0 : sJ > this.maxHeightIndex ? this.maxHeightIndex : sJ; 
		eJ = eJ < 0 ? 0 : eJ > this.maxHeightIndex ? this.maxHeightIndex : eJ;

		var res = [];

		for (var i = sI; i < eI; ++i) {
			for (var j = sJ; j < eJ; ++j) {

				if(this.grid[i][j].entities.length > 0) {

					for (var k = 0, len = this.grid[i][j].entities.length; k < len; ++k){

						if(sourceEntity.key != this.grid[i][j].entities[k].owner.key){
							res.push(this.grid[i][j].entities[k].owner);
						}
					}
						
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
	/*
	# Entities managing
	*/
	validateEntity : function(entity){
		//console.log("validateEntity ! ", entity);
		for (var i = 0, len = entity.childs.length; i < len; ++i){
			var coor = this.coorToIndex(entity.childs[i].object.position.x, entity.childs[i].object.position.y);
			
			if(!coor){
				console.error("Cannot validate slot for entity square : ", entity.childs[i]);
				continue;
			}

			this.grid[coor.i][coor.j].state = 3;
		}
	},
	currEntitiesIndex : -1,
	currEntitiesList : null,
	nextEntity : function(){
		if (!this.currEntityList || this.currEntitiesIndex >= this.currEntityList.length){
			this.currEntityList = this.getEntitiesList();
			this.currEntitiesIndex = -1;
		}

		return ++this.currEntitiesIndex < this.currEntityList.length ? this.currEntityList[this.currEntitiesIndex] : null;
	},
	getEntitiesList : function(){
		var res = [];

		for (var i = 0; i < this.maxWidthIndex; ++i) {
	
			for (var j = 0; j < this.maxHeightIndex; ++j) {
				if(this.grid[i][j].entities.length > 0 && this.grid[i][j].state != 3) {
					for (var e = 0; e < this.grid[i][j].entities.length; ++e){

						if(this.grid[i][j].entities[e].isHead) {
							res.push(this.grid[i][j].entities[e].owner);
						}
						
					}
					
				}
					
			}
		}

		return res;

	},
	gridToString : function (){
		console.log("*** Grid : ***");

		for (var i = 0; i < this.maxHeightIndex + 1; ++i) {

			var msg = (i < 10 ? i+" " : i) + " # ";

			for (var j = 0; j < this.maxWidthIndex + 1; ++j) {
				msg += ' ' + (this.grid[i][j].state == 0 ? '.' : this.grid[i][j].state) + ' ,';
			}
			console.log(msg + " #");
		}

		console.log("***  END  ***");

	}

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
		3 : posed
*/
GridSlot.prototype = {
	init : function(data){
		this.threeX = data.threeX;
		this.threeY = data.threeY;
		this.entities = [];
		this.state = 0;
		

	},
	addEntity : function(entitySquare){
		this.state = 2;
		this.entities.push(entitySquare);
	},
	removeEntity : function(entitySquare){
		if (this.entities.length == 1){
			this.state = 0;
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
