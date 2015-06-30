var EntitiesManager = function (data){
	this.entities = {};
	this.init(data);
}

EntitiesManager.prototype = {
	init : function(data){
		this.count = 0;
		this.threeWrapper = data.threeWrapper;
		this.last = null;
		this.first = null;
	},
	add : function(entity){
		++this.count;
		
		if(!this.first){
			this.first = entity;
		}

		if(this.entities[entity.key]){
			console.warn(entity.key + " is already in manager.");
		}

		this.last = entity;
		this.entities[entity.key] = entity;
	},
	remove : function(entity){
		if(!this.entities[entity.key])
			return;

		--this.count;

		if (this.last && entity.key === this.last.key) {
			this.last = null;
		}
		if (this.last && entity.key === this.first.key){
			this.first = null;
		}

		delete this.entities[entity.key];
	},
	get : function(key) {
		return this.entities[key] || null;
	},
	clear : function(){
		this.count = 0;
		this.first = null;
		this.last = null;
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