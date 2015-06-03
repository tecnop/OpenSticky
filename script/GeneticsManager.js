var GeneticsManager = function(data){
	this.init(data);
}

GeneticsManager.prototype = {
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
	evaluate : function(data){
		var me = this,
			populationFitness = me.threeWrapper.calculatePopulationFitness(),
			fitnessAvg = calculateFitnessAverage(data);
		
		var res = {
				levels : {
					lvl1 : {},
					lvl2 : {},
					lvl3 : {},
					lvl4 : {},
					lvl5 : {}
				},
			};
		
		for(var k in me.selection){
			var currColorFactor = me.selection[k].evaluate(me.threeWrapper);
			

			if (currColorFactor <= 0.1){
				res.levels.lvl1[k] = me.selection[k];
			}
			else if (currColorFactor <= 0.25) {
				res.levels.lvl2[k] = me.selection[k];
			}
			else if (currColorFactor <= 0.5) {
				res.levels.lvl3[k] = me.selection[k];
			}
			else if (currColorFactor <= 0.5) {
				res.levels.lvl4[k] = me.selection[k];
			}
			else  {
				res.levels.lvl5[k] = me.selection[k];
			}
		}
		me.SELECTION_TYPE[me.SELECTION_INDICE](me, data);


	},
	calculateFitnessAverage : function(data){

	},
	add : function(entity){
		this.selection[entity.key] = entity;
	},
	remove : function(entity){
		delete this.selection[entity.key];
	}
	
}