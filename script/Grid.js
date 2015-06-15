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
	init : function(data){
		console.log(data);
		this.step = data.step;
		this.width = data.imagePlaneWrapper.rect.width;
		this.height = data.imagePlaneWrapper.rect.height;


		var w = (this.width - (this.width % this.step)) / this.step,
			h = (this.height - (this.height % this.step)) / this.step,
			startX = data.imagePlaneWrapper.rect.topLeft.x - ( data.imagePlaneWrapper.rect.topLeft.x % this.step),
			currX = startX,
			/*Poulet au*/ currY =  data.imagePlaneWrapper.rect.topLeft.y - ( data.imagePlaneWrapper.rect.topLeft.y % this.step);

		this.grid = [];
		this.maxWidth = this.width - (this.width % this.step);
		this.maxHeight = this.height - (this.height % this.step);

		this.maxWidthIndex = w;
		this.maxHeightIndex = h;

		console.log(" w : " + w + " h : " + h + " step : " + this.step);

		var lineMsg = "";

		for (var i = 0; i < w; ++i) {
			this.grid.push([]);


			lineMsg += "[" 
			for (var j = 0; j < h; ++j) {
				this.grid[i].push(new GridSlot({
					threeX : currX,
					threeY : currY,
				}));

				lineMsg += "x : " + currX + ", y : " + currY;

				currX += this.step;
			}
			lineMsg += "]\n" 
			currX = startX;
			currY -= this.step;
		}
		console.log(lineMsg);

	},
	addSquaredEntityByCoor : function(entity){
		var coor = this.coorToIndex(entity.head.object.position.x, entity.head.object.position.y);

		this.addSquaredEntityByIndex(entity, coor.i, coor.j);
	},
	addSquaredEntityByIndex : function(entity, i , j){
		if ( i < 0 || i > this.maxWidthIndex ||
			 j < 0 || j > this.maxHeightIndex) {

			return;
		}

		this.grid[i][j].addEntity(entity.head);

		/*for (var cpt = 0, len = entity.childs.length; cpt < len; ++cpt){

		}*/
	},
	coorToIndex : function(x, y){
		x = x - (x % this.step);
		y = y - (y % this.step);

		return {i : x / this.step, j : y / this.step};
	},
	getSlotByCoor : function (x, y){
		var coor = this.coorToIndex(x, y);

		return this.getSlotByIndex(coor.i, coor.j);
	},
	getSlotByIndex : function(i , j){
		if ( i < 0 || i > this.maxWidthIndex ||
			 j < 0 || j > this.maxHeightIndex) {

			return null;
		}

		return this.grid[i][j];
	},
	// Caca
	getItemByCoor : function(x, y){
		x = x - (x % this.step);
		y = y - (y % this.step);

		var i = parseInt( ( (this.width / 2) - (this.step /2) ) + x) ,
			j = parseInt( ( (this.height / 2) - (this.step /2) ) + y);
		
		if(i > this.grid.length || j > this.grid[i].length)
			return null;

		return this.grid[i][j];
	},
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
	setPending : function(entitySquare){

	}
}
