var GeneticsManager = function(data){
	this.init(data);
}

GeneticsManager.prototype = {
	LOG : true,
	SELECTION_TYPE : [
		// Roulette
		function (context, data){

		},
		// Tournament
		function (context, data){

		}
	],
	TOURNAMENT_PICK_NUMBER : 10,
	SELECTION_INDICE : 0,
	init : function(data){
		var me = this;

		me.threeWrapper = data.threeWrapper;
		me.selection = {};
	},
	fastEvaluation : function(){
		var me = this,
			toRemFromSelection = [];
			

		for(var k in me.selection){
			var prob = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
			if(prob > 95){
				var col = me.threeWrapper.entitiesManager.entities[k].actions.rules.getsquare(me.threeWrapper);
				if(col){
					me.threeWrapper.entitiesManager.entities[k].setColor(col);
					toRemFromSelection.push(me.selection[k]);
					
				}
				
			}
			else {
				me.selection[k].destination = me.threeWrapper.getRandomPositionInImagePlane(
					me.selection[k].object.position.z
				);
				toRemFromSelection.push(me.selection[k]);
			}
		}

		for(var i = 0; i < toRemFromSelection.length; ++i){
			me.remove(toRemFromSelection[i]);
		}
	},
	add : function(entity){
		this.selection[entity.key] = entity;
	},
	remove : function(entity){
		delete this.selection[entity.key];
	}
	
}
