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
		
		if(this.entities[entity.key]){
			console.warn(entity.key + " is already in manager.");
		}

		this.entities[entity.key] = entity;
	},
	remove : function(entity){
		if(!this.entities[entity.key])
			return;

		--this.count;
		delete this.entities[entity.key];
	},
	clear : function(){
		this.count = 0;
		delete this.entities;
		this.entities = {};
	},
	calculateCount : function(){
		var res = 0;
		for (var k in this.entities)
			++res;
		return res;
	}
}