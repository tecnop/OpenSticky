var GeneticsManager = function(data){
	this.init(data);
}

GeneticsManager.prototype = {
	LOG : false,
	MAX_CROSS_PICK_COUNT : 6,
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
	squareEvaluationByStep : function (three, entity){
		/* Grid Infos : <List>
			0 totalCases,
			1 currentSquares,
			2 missingCases,
			3 lockedCases
		*/
		var gridInfos = three.grid.getGridInfos();
		
		var toKill = gridInfos[1] - gridInfos[2],
			entityFitness = entity.calculateFitness(three).percent,
			ratio = parseInt(toKill * 100 / gridInfos[2] );

		if(this.LOG){
			console.log("[#] ratio : " + ratio + " ; toKill : " + toKill);
		}

		// Stable
		if (Math.abs(ratio) <= 10){

			if(this.LOG){
				console.log("\t # Stable");
			}

			

			// I'm perfect
			if (entityFitness >= 100){

				var validateRdm = Math.floor(Math.random() * 100);

				if(validateRdm <= 95){

					if(this.LOG){
						console.log("\t\t -> validate");
					}

					return new Actions({validate : [entity]});
				} else {

					if(this.LOG){
						console.log("\t\t -> validate, but move anyway");
					}

					return new Actions({move : [entity]});
				}
			} 
			// I'm not bad ..
			else if (entityFitness >= 40 ){

				var squares = entity.removeSquares(1);

				if(!squares){
					if(this.LOG){
						console.log("\t\t -> No square found. move anyway");
					}

					return new Actions({move : [entity]});
				}else {
					if(this.LOG){
						console.log("\t\t -> Remove square");
					}
					return new Actions({removeSquares : squares});
				}
			}
			// I'm bad (i'm bad !)
			else {
				var rdm = Math.floor(Math.random() * 100);


				// Move Anyway
				if (rdm <= 20){
					return new Actions({move : [entity]});
				}
				// Cross
				else if (rdm <= 60){
					var selection = this.prepareCross(three, entity);
					
					if(!selection){
						return new Actions({move : [entity]});
					}

					var choiceRdm = Math.floor(Math.random() * 100);
					
					if (selection[0].length > 0) {
						return new Actions({add : [selection[0].pop()]});
					}

					if (choiceRdm <= 5 && selection[3].length > 0){
						return new Actions({add : [selection[3].pop()]});
					}
					if (choiceRdm <= 15 && selection[2].length > 0) {
						return new Actions({add : [selection[2].pop()]});
					}
					if (choiceRdm <= 40 && selection[1].length > 0){
						return new Actions({add : [selection[1].pop()]});
					}
					
					return new Actions({move : [entity]});
				}
				else {
					var squares = entity.removeSquares(1);
					
					if(!squares){
						if(this.LOG){
							console.log("\t\t -> No square found. move anyway");
						}

						return new Actions({move : [entity]});
					}else {
						if(this.LOG){
							console.log("\t\t -> Remove square");
						}
						return new Actions({removeSquares : squares});
					}
				}
			}

		}
		// Need More !
		else if (ratio < 0) {
			var rdm = Math.floor(Math.random() * 100);

			if(this.LOG){
				console.log("\t # More");
			}

			// Validate if i'm perfect
			if (rdm <= 5 && entityFitness == 100){
				if(this.LOG){
					console.log("\t\t -> Validate.");
				}
				return new Actions({validate : [entity]});
			}

			// Move anyway
			if (rdm <= 20) {
				if(this.LOG){
					console.log("\t\t -> Move anyway.");
				}
				return new Actions({move : [entity]});
			}
			// Cross
			else if (rdm <= 100){ // OLD : 65

				if(this.LOG){
					console.log("\t\t -> Cross");
				}

				var moveRdm = Math.floor(Math.random() * 100);
				// Move anyway ..
				if (moveRdm < 15) {
					if(this.LOG){
						console.log("\t\t\t -> Cross, but move anyway.");
					}

					return new Actions({move : [entity]});
				}

				var selection = this.prepareCross(three, entity);

				// Nothing found for crossing .. Move
				if (!selection){
					if(this.LOG){
						console.log("\t\t\t -> Cross, nothing to pick. Move anyway.");
					}
					return new Actions({move : [entity]});
				}

				if(this.LOG){
					console.log("\t\t\t -> Cross, selection : ", selection);
				}
				
				var choiceRdm = Math.floor(Math.random() * 100);
				
				if (choiceRdm <= 5 && selection[3].length > 0){
					return new Actions({add : [selection[3].pop()]});
				}
				if (choiceRdm <= 15 && selection[2].length > 0) {
					return new Actions({add : [selection[2].pop()]});
				}
				if (choiceRdm <= 40 && selection[1].length > 0){
					return new Actions({add : [selection[1].pop()]});
				}
				if (selection[0].length > 0) {
					return new Actions({add : [selection[0].pop()]});
				}
				
				if(this.LOG)
					console.log("\t\t -> No selection found in cross.. Move");
				
				return new Actions({move : [entity]}); 
				
			}
			// Mutate
			else { // TODO
				if(this.LOG){
					console.log("\t\t -> Mutate");
				}
			}
		}
		// Less ...
		else {
			if(this.LOG){
				console.log("\t # Less");
			}
			// It's TOO TOO much, sorry for you ... 
			if (ratio > 25){
				return new Actions({remove : [entity]});
			}

			var rdm = Math.floor(Math.random() *100);

			// Validate if i'm perfect
			if (rdm <= 5 && entityFitness == 100){
				if(this.LOG){
					console.log("\t\t -> Validate.");
				}
				return new Actions({validate : [entity]});
			}

			// Move anyway
			if (rdm <= 20) {
				if(this.LOG){
					console.log("\t\t -> Move anyway.");
				}
				return new Actions({move : [entity]});
			}

			var squares = entity.removeSquares(1);

			if(!squares){
				if(this.LOG){
					console.log("\t\t -> No square found. move anyway");
				}

				return new Actions({move : [entity]});
			}else {
				if(this.LOG){
					console.log("\t\t -> Remove square");
				}
				return new Actions({removeSquares : squares});
			}
			
		}
	},
	prepareCross : function(three, entity, max){
		var slot = three.grid.getSlotByMap(entity.getPosition().x, entity.getPosition().y);
		
		var pickable = three.grid.getEntitiesInRectAdvanced(slot.i - 7, slot.i + 7, slot.j -7, slot.j +7, this.MAX_CROSS_PICK_COUNT, entity);

		// Nothing found for crossing .. Move
		if (pickable.length <= 0){

			return null;
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
				if(this.LOG){
					console.log("\t\t\t -> Cross, created entity is corrupted. Continue");
				}
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

			if(++cpt >= this.MAX_CROSS_PICK_COUNT){
				break;
			}
		}

		return selection;
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



