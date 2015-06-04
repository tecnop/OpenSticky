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
	evaluation : function(){
		var me = this,
			
			toRemFromSelection = [];

		
		
		


		var cpt = 0;
		for(var k in me.selection) {
			var currColorFactor = me.selection[k].evaluate(me.threeWrapper);

			if (currColorFactor <= 0.1){
				me.threeWrapper.entitiesManager.remove(me.selection[k]);
			}
			else if (currColorFactor <= 0.25) {
				
				if(cpt%2 == 0) {
					me.threeWrapper.entitiesManager.remove(me.selection[k]);
				}
				else {
					me.selection[k].destination = me.threeWrapper.getRandomPositionInImagePlane(
						me.selection[k].object.position.z
					);
					toRemFromSelection.push(me.selection[k]);
					
				}
				
			}
			else if (currColorFactor <= 0.5) {
				me.selection[k].destination = me.threeWrapper.getRandomPositionInImagePlane(
					me.selection[k].object.position.z
				);
				toRemFromSelection.push(me.selection[k]);
			}
			else if (currColorFactor <= 0.75) {
				me.selection[k].destination = me.threeWrapper.getRandomPositionInImagePlane(
					me.selection[k].object.position.z
				);
				toRemFromSelection.push(me.selection[k]);
			}
			else  {
				me.selection[k].destination = me.threeWrapper.getRandomPositionInImagePlane(
					me.selection[k].object.position.z
				);
				toRemFromSelection.push(me.selection[k]);
			}

			++cpt;
		}
		
		var populationFitness = me.threeWrapper.calculatePopulationFitness(),
			toKill = populationFitness < 0 ? Math.abs(populationFitness) : 0;

		console.log("populationFitness === " + populationFitness);

		if (populationFitness > 0){
			me.threeWrapper.entitiesManager.add(new Entity.random({cube:true}));
		}

		for(var i = 0; i < toRemFromSelection.length; ++i){
			me.remove(toRemFromSelection[i]);
		}

	},
	evaluate : function(data){
		var me = this,
			populationFitness = me.threeWrapper.calculatePopulationFitness(),
			toKill = populationFitness < 0 ? Math.abs(populationFitness) : 0;
		
		var totalColorFactor = 0.0,
			res = {
				levels : [
					[],
					[],
					[],
					[],
					[]
				],
			};
		
		for(var k in me.selection) {
			var currColorFactor = me.selection[k].evaluate(me.threeWrapper);
			
			totalColorFactor += currColorFactor;

			if (currColorFactor <= 0.1){
				res.levels[0].push(me.selection[k]);
			}
			else if (currColorFactor <= 0.25) {
				res.levels[1].push(me.selection[k]);
			}
			else if (currColorFactor <= 0.5) {
				res.levels[2].push(me.selection[k]);
			}
			else if (currColorFactor <= 0.75) {
				res.levels[3].push(me.selection[k]);
			}
			else  {
				res.levels[4].push(me.selection[k]);
			}
		}

		if (toKill > 0){

			for( var lvl = 0; lvl < res.levels.length; ++lvl){

				for(var i = 0, len = res.levels[lvl].length; i < len ; ++i){
					--toKill;
					me.threeWrapper.entitiesManager.remove(res.levels[lvl][i].key);

					if (toKill <= 0){
						break;
					}
				}

				if (toKill <= 0){
					break;
				}

			}

			
		}
		else if (populationFitness > 0){
			for (var i = 0; i < populationFitness; ++i) {
				me.threeWrapper.entitiesManager.add(new Entity.random({cube:true}));
			}
		}
		

		for ( var i = 0; i < res.levels[0].length; ++i) {
			me.threeWrapper.entitiesManager.remove(res.levels[0][i].key);
		}

		for ( var i = 0; i < res.levels[1].length; ++i) {

			if(i%2 == 0) {
				me.threeWrapper.entitiesManager.remove(res.levels[1][i].key);
			}
			else {
				res.levels[1][i].destination = me.threeWrapper.getRandomPositionInImagePlane(
					res.levels[1][i].object.position.z
				);
				me.remove(res.levels[1][i]);
			}

		}

		for ( var i = 0; i < res.levels[2].length; ++i) {
			res.levels[2][i].destination = me.threeWrapper.getRandomPositionInImagePlane(
				res.levels[2][i].object.position.z
			);
			me.remove(res.levels[2][i]);
		}

		for ( var i = 0; i < res.levels[3].length; ++i) {
			res.levels[3][i].destination = me.threeWrapper.getRandomPositionInImagePlane(
				res.levels[3][i].object.position.z
			);
			me.remove(res.levels[3][i]);
		}

		for ( var i = 0; i < res.levels[4].length; ++i) {
			res.levels[4][i].destination = me.threeWrapper.getRandomPositionInImagePlane(
				res.levels[4][i].object.position.z
			);
			me.remove(res.levels[4][i]);
		}


		for ( var i = 0; i < res.levels[3].length; ++i) {
			for ( var j = 0; j < res.levels[4].length; ++j) {
				res.levels[4][j].mutate(res.levels[3][i]);
			}
		}

		for ( var i = 0; i < res.levels[3].length; ++i) {
			for ( var j = 0; j < res.levels[2].length; ++j) {
				res.levels[2][j].mutate(res.levels[3][i]);
			}
		}

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