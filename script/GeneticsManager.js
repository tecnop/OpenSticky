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
	},
	evaluate : function(data){
		var me = this,
			fitnessAvg = calculateFitnessAverage(data);
			
		me.SELECTION_TYPE[me.SELECTION_INDICE](me, data);

	},
	calculateFitnessAverage : function(data){

	}
	
}