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
	squareEvaluationByStep : function (three, entity){
		var toKill = three.grid.entitiesCases - three.grid.expectedCases,
			entityFitness = entity.calculateFitness(three).percent,
			ratio = parseInt(toKill * 100 / three.grid.expectedCases);

		// Stable
		if (Math.abs(ratio) <= 10){

			// I'm perfect
			if (entityFitness >= 100){
				return new Actions({validate : [entity]});
			}
		}
		// More !
		else if (ratio < 0) {
			var rdm = Math.floor(Math.random() * 100);

			// Cross
			if (rdm >= 0){ // CHANGE ME
				var moveRdm = Math.floor(Math.random() * 100);

				// Move anyway ..
				if (moveRdm < 15) {
					return new Actions({move : [entity]});
				}

				var max = 5;
				
				var coor = three.grid.coorToIndex(entity.getPosition().x, entity.getPosition().y);
				
				var pickable = three.grid.getEntitiesInRectAdvanced(coor.i - 5, coor.i + 5, coor.j -5, coor.j +5, entity);

				// Nothing found for crossing .. Move
				if (pickable.length <= 0){
					return new Actions({move : [entity]});
				}

				var cpt = 1,
					selection = [
						[], // perfect (100)
						[], // middle class (40)
						[], // bad's (20)
						[]  // zero (0)
					];
				
				for (var i = 0, len = pickable.length; i < len; ++i) {
					
					var inc = entity.randomCross(pickable[i]),
						destination = new THREE.Vector3(
							(entity.getPosition().x + pickable[i].getPosition().x) /2 ,
							(entity.getPosition().y + pickable[i].getPosition().y) /2 ,
							(entity.getPosition().z + pickable[i].getPosition().z) /2
						);


					// Result is corrupted (a kind of zombie !) ..
					if(!inc) {
						continue;
					}

					destination = three.grid.clipCoor(destination);

					inc.add(destination);
					
					inc.destination = destination;

					var fitness = inc.calculateFitness(three);

					if (fitness.percent >= 100){
						selection[0].push(inc);
					}
					else if (fitness.percent >= 40){
						selection[1].push(inc);
					}
					else if (fitness.percent > 0){
						selection[2].push(inc);
					}
					else {
						selection[3].push(inc);
					}

					if(++cpt >= max){
						break;
					}
				}
				
				var choiceRdm = Math.floor(Math.random() * 100);
				

				if (choiceRdm < 5 && selection[3].length > 0){
					return new Actions({add : [selection[3].pop()]});
				}
				if (choiceRdm < 15 && selection[2].length > 0) {
					return new Actions({add : [selection[2].pop()]});
				}
				if (choiceRdm < 40 && selection[1].length > 0){
					return new Actions({add : [selection[1].pop()]});
				}
				if (selection[0].length > 0) {
					return new Actions({add : [selection[0].pop()]});
				}

				// Mmh .. I hope it will never go there ..
				console.warn("No selection found in cross..");
				return null; 
				
			}
			// Mutate
			else { // TODO

			}
		}
		// Less ...
		else {

			// It's TOO TOO much, sorry for you ... 
			if (ratio > 50){
				return new Actions({remove : [entity]});
			}

			var squares = entity.removeSquares(1);

			return new Actions({removeSquares : [squares]});
		}

		return;
		// Trop
		if (toKill > 0){
			//parseInt(res * 100 / this.childs.length)
			ratio = parseInt(toKill * 100 / three.grid.expectedCases);
		}
		// Pas assez 
		else {
			ratio = parseInt((-1*toKill) * 100 / three.grid.expectedCases);
		}

		if (ratio <= 10){

		}
	},
	squareEvaluation : function(three){
		var toKill = three.grid.entitiesCases - three.grid.expectedCases,
			res = [[],[],[]],
			incRes =  [[],[],[]];


		var curr = three.grid.getEntitiesInRect(0, three.grid.maxWidthIndex, 0 , three.grid.maxHeightIndex);

		if (!curr) {
			return;
		}

		for (var k = 0,len = curr.length; k < len; ++k) {

			var fitness = curr[k].calculateFitness(three);

			
			if(fitness.percent >= 100) {
				res[0].push(curr[k]);
			}
			else if (fitness.percent >= 40) {
				res[1].push(curr[k]);
			}
			else {
				res[2].push(curr[k]);
			}

		}

		// Some cool CROSSes
		for (var i = 0, max = parseInt(res[0].length / 2), last = res[0].length -1; i < max; ++i, --last){
			var inc = res[0][i].randomCross(res[0][last]),
				postion = new THREE.Vector3(
					(res[0][i].getPosition().x + res[0][last].getPosition().x) /2 ,
					(res[0][i].getPosition().y + res[0][last].getPosition().y) /2 ,
					res[0][i].getPosition().z //(res[1][i].getPosition().z + res[1][last].getPosition().z) /2
				);

			if(!inc)
				continue;

			three.grid.clipCoor(postion);

			//inc.add(postion);
			inc.destination = postion;

			var fitness = inc.calculateFitness(three);

			if (fitness.percent >= 100) {
				incRes[0].push(inc);
			}
			else if (fitness.percent >= 40) {
				incRes[1].push(inc);
			}
			else {
				incRes[2].push(inc);
			}
		}
		// Some mid CROSSes
		for (var i = 0, max = parseInt(res[1].length / 2), last = res[1].length -1; i < max; ++i, --last){
			var inc = res[1][i].randomCross(res[1][last]),
				postion = new THREE.Vector3(
					(res[1][i].getPosition().x + res[1][last].getPosition().x) /2 ,
					(res[1][i].getPosition().y + res[1][last].getPosition().y) /2 ,
					res[1][i].getPosition().z //(res[1][i].getPosition().z + res[1][last].getPosition().z) /2
				);

			if(!inc)
				continue;

			three.grid.clipCoor(postion);

			//inc.add(postion);
			inc.destination = postion;

			var fitness = inc.calculateFitness(three);

			if (fitness.percent >= 100) {
				incRes[0].push(inc);
			}
			else if (fitness.percent >= 40) {
				incRes[1].push(inc);
			}
			else {
				incRes[2].push(inc);
			}
		}
		

		var actions = {
			add : [],
			remove : [],
			validate : [],
			move : []
		};

		var expectedWithBonus = three.grid.expectedCases + ( toKill > 0 ? parseInt(toKill / 3) : parseInt(three.grid.expectedCases / 10) );

		var expectedFromRes = parseInt(expectedWithBonus * 1.6) - expectedWithBonus;

		var expectedFromInc = expectedWithBonus - expectedFromRes;

		var curr = three.grid.entitiesCases;

		var validatedLength = 0;

		var checkingRes = true;

		var currIncLength = 0,
			currResLength = 0;

		console.log("# Image Cases : " + three.grid.expectedCases);
		console.log("# Current Cases : " + three.grid.entitiesCases);
		console.log("# ToKill : " + toKill);

		console.log("# expectedWithBonus (expected + toKill / 3) : " + expectedWithBonus);
		

		console.log("# expected (res / inc) : (" + expectedFromRes + " + " +  expectedFromInc + ") = " + (expectedFromRes + expectedFromInc));

		// Adding Inc
		while (currIncLength <= expectedFromInc) {

			if (incRes[2].length > 0) {
				choice =  incRes[2].pop();
				//actions.validate.push(choice);
			}
			else if (incRes[1].length > 0){
				choice =  incRes[1].pop();
			}
			else if (incRes[0].length > 0){
				choice =  incRes[0].pop();
			}
			else {
				break;
			}

			if(choice){
				currIncLength += choice.childs.length;
				actions.add.push(choice);
			}
		}

		// Adding Res
		currResLength += currIncLength;

		while (currResLength <= expectedWithBonus) {

			if (res[2].length > 0) {
				choice =  res[2].pop();
				actions.validate.push(choice);
			}
			else if (res[1].length > 0){
				choice =  res[1].pop();
				actions.move.push(choice);
			}
			else if (res[0].length > 0){
				choice =  res[0].pop();
				actions.move.push(choice);
			}
			else {
				break;
			}

			if(choice){
				currResLength += choice.childs.length;

				//actions.add.push(choice);
			}
		}

		// remove others
		for (var i = 0, len = res[0].length; i < len; ++i){
			actions.remove.push(res[0][i]);
		}

		for (var i = 0, len = res[1].length; i < len; ++i){
			actions.remove.push(res[1][i]);
		}

		for (var i = 0, len = res[2].length; i < len; ++i){
			actions.remove.push(res[2][i]);
		}

		console.log(actions);
		three.executeActions(actions);

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


var Actions = function(data){
	this.init(data);
};

Actions.prototype = {
	init : function (data){
		this.add = data.add;
		this.remove = data.remove;
		this.move = data.move;
		this.validate = data.validate;

		this.addSquares = data.removeSquares;
		this.removeSquares = data.removeSquares;
	}
};