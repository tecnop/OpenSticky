var HiddenCanvas = function(data){
	this.init(data);
};
HiddenCanvas.prototype = {
	
	init : function(data){
		var me = this;
		me.canvas = data.canvas;
		me.canvasGraphics = data.canvas.getContext('2d');


	},
	loadImage : function(path, callback){
		var me = this;
		
		me.img = new Image();

		me.active = false;
		me.topLeft = {};
		me.bottomRight = {};

		me.img.src = path;
		me.img.onload = function(){
			me.active = false;

			me.canvas.width = me.img.width;
			me.canvas.height = me.img.height;

			me.topLeft = {
				x : parseInt(me.img.width / 2) * -1,
				y : parseInt(me.img.height / 2)
			}
			me.topRight = {
				x : parseInt(me.img.width / 2),
				y : parseInt(me.img.height / 2) * -1
			}

			me.canvasGraphics.drawImage(me.img, 0, 0, me.img.width, me.img.height);
			// get the pixel data and callback

			//me.imageData = me.canvasGraphics.getImageData(0, 0, me.canvas.width, me.canvas.height);
			me.active = true;


			callback(me);
		}

	},
	getPixel : function(imagePlane, originCoor){
		var me = this;
		if (!me.active)
			return null;

		// TODO : IF OUT ON BOUNDZZ RETURN NULL

		var x = imagePlane.position.x + originCoor.x,
			y = imagePlane.position.y + (originCoor.y * -1); // ???

		// Debug 
		//me.canvasGraphics.fillRect(parseInt(me.canvas.width / 2) + x, parseInt(me.canvas.height / 2) + y, 2, 2);
		
		return me.canvasGraphics.getImageData(parseInt(me.canvas.width / 2) + x, parseInt(me.canvas.height / 2) + y, 1, 1).data;
	},
	getSquare : function(imagePlane, entity, size){
		var me = this;
		if (!me.active)
			return null;


		var x = imagePlane.position.x + entity.object.position.x,
			y = imagePlane.position.y + (entity.object.position.y * -1); // Reverse img on y

		/*me.canvasGraphics.fillRect(
			parseInt( ((me.canvas.width / 2 ) - (entity.size.width /2) ) + x),
			parseInt( ((me.canvas.height/ 2 ) - (entity.size.height /2) ) + y), 
			entity.size.width, 
			entity.size.height);*/

		return me.canvasGraphics.getImageData(
			parseInt( ( (me.canvas.width / 2) - (entity.size.width /2) ) + x),
			parseInt( ( (me.canvas.height/ 2) - (entity.size.height /2) ) + y), 
			size.width, 
			size.height).data;
		
	},
	getSquareColor : function(imagePlane, entity, size){
		var me = this;

		var data = me.getSquare(imagePlane, entity, size);

		if(!data)
			return null;

		var arr = [0,0,0,0],
			cpt = data.length / 4;

		for(var i = 0, len = data.length; i < len; i+=4){
			arr[0] += data[i];
			arr[1] += data[i + 1];
			arr[2] += data[i + 2];
			arr[3] += data[i + 3];
		}
		
		return new THREE.Color("rgb(" +
			parseInt(arr[0] / cpt) + "," +
			parseInt(arr[1] / cpt) + "," +
			parseInt(arr[2] / cpt) +")"
		);
	}
}