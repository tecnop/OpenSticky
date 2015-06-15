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
		this.step = data.step;
		this.width = data.imagePlaneWrapper.width;
		this.height = data.imagePlaneWrapper.height;

		var w = (this.width - (this.width % this.step)) / this.step,
			h = (this.height - (this.height % this.step)) / this.step,
			currX = data.imagePlaneWrapper.rect.x - (data.imagePlaneWrapper.rect.x % this.step),
			/*Poulet au*/ currY = data.imagePlaneWrapper.rect.y - (data.imagePlaneWrapper.rect.y % this.step);

		this.grid = [];


		for (var i = 0; i < w; ++i) {
			this.grid.push([]);

			for (var j = 0; j < h; ++j) {
				this.grid[i].push({
					entity : null,

				});
			}
			currX += this.step;
		}

	},
	getItemByCoor : function(x, y){
		x = x - (x % this.step);
		y = y - (y % this.step);

		var i = parseInt( (this.width / 2) - (this.step /2) ) + x),
			j = parseInt( (this.height / 2) - (this.step /2) ) + y);
		
		if(i > this.grid.length || j > this.grid[i].length)
			return null;

		return this.grid[i][j];
	},
	getItemByIndex : function(i, j){

		if(i > this.grid.length || j > this.grid[i].length)
			return null;

		return this.grid[i][j];
	},
	getRandomPosition : function(z){

		var rI = Math.floor(Math.random() * this.grid.length),
			choosenOne = this.grid[rI][ Math.floor(Math.random() * this.grid[rI].length) ]

		return new THREE.Vector3(
			 Math.floor(Math.random() * this.grid.length) * 
		);


	}



}

