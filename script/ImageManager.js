var ImageManager = function (data){
	this.init(data);
}

ImageManager.prototype = {
	init : function(data){
		var me = this,
			errImg = new Image(),
			pointerImg = new Image();

		errImg.src = me.imagePath + 'err' + me.imageExt;
		pointerImg.src = me.imagePath + 'pointer' + me.imageExt;
		me.imagesMap['err'] = errImg;

		me.imagesMap['pointer'] = pointerImg;

		for (var i = 0; i < entities.length; i++){
			var img = new Image();
			img.src = me.imagePath + entities[i].key + me.imageExt;
			me.imagesMap[entities[i].key] = img;
		}
	
	}
}