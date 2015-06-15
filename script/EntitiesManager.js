var EntitiesManager = function (data){
	this.entities = {};
	this.init(data);
}

EntitiesManager.prototype = {
	init : function(data){
		this.count = 0;
		this.threeWrapper = data.threeWrapper;
	},
	add : function(entity){
		++this.count;
		this.entities[entity.key] = entity;
		//this.threeWrapper.scenes.main.add(entity.object);
		//this.threeWrapper.geneticsManager.add(entity);
	},
	remove : function(entity){
		if(!this.entities[entity.key])
			return;

		--this.count;
		this.threeWrapper.scenes.main.remove(entity.object);
		this.threeWrapper.geneticsManager.remove(entity);
		delete this.entities[entity.key];
	},
	calculateCount : function(){
		var res = 0;
		for (var k in this.entities)
			++res;
		return res;
	}
}