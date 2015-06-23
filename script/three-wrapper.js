var ThreeWrapper = function (data){
	this.inject(data);
}
ThreeWrapper.prototype  = {
	SQUARE_ENTITY_MODE : false,
	// Camera attributes
	MAX_Z : 5000,
	VIEW_ANGLE : 45,
	NEAR : 1,
	FAR : 10000,
	CAMERA_Z : 1300,
	// Entity
	count : 1,
	Z_GAP : 300,
	Z_STEP : 0.1,
	MIN_SPEED : 25,
	MAX_SPEED : 25,
	MIN_DEPTH : 10,
	MAX_DEPTH : 10,
	//
	startDelay : 2,
	gridStep : 20,
	paused : false,
	entitiesSpeedFactor : 1,
	defaultImage : 'img/jap.jpg',
	entitiesManager : null,
	inject : function(data){
		var me = this;
		me.evaluateMode = false;

		me.size = data.size || {width : 800, height : 600};
		me.imagePlaneSize = data.imagePlaneSize || {width : 800, height : 600};
		me.paused = data.paused || false;

		me.container = $('<div style="width:' + me.size.width + 'px;height:' + me.size.height + 'px;">');
		
		me.orbitContainer = data.orbitContainer;

		me.time = {
			lastTime : 0,
			deltaTime : 1000/60,
		}

		me.entitiesManager = new EntitiesManager({threeWrapper : me});

		me.geneticsManager = new GeneticsManager({threeWrapper : me});

		me.imagePlaneWrapper = {
			imagePlane : null,
			hiddenCanvas : new HiddenCanvas({canvas : data.hiddenCanvas}),
			size : {
				width : 0,
				height : 0,
			}
		}

		me.aspect = me.size.width / me.size.height;
		me.scenes = {};
		me.cameras = {};


		
		/*
			MouseWheel listener
		*/
		// FireFox case
		$(me.container).bind("DOMMouseScroll",function (e) {
			var factor = e.ctrlKey ? 50 : 5;

			var fake = new THREE.Vector3(1,1,1),
				vec = fake.subVectors(
						me.imagePlaneWrapper.imagePlane.position,
						me.cameras.main.position
					);

			// UP
			if (e.originalEvent.detail && e.originalEvent.detail <= 0)
			{
		    	if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(factor,factor,factor)));
		    	}
		    }
		    // Down
		    else {
		    	if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(-factor,-factor,-factor)));
		    	}
		    }

		   	
		   	e.stopPropagation();
		   	e.preventDefault();
		   	return false;

		});

	

		// Others
		$(me.container).bind("mousewheel",function (e) {
			var factor = e.ctrlKey ? 50 : 5;

			var fake = new THREE.Vector3(1,1,1),
				vec = fake.subVectors(
						me.imagePlaneWrapper.imagePlane.position,
						me.cameras.main.position
					);

			// UP
			if (e.originalEvent.wheelDelta && e.originalEvent.wheelDelta >= 0){
		        if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(factor,factor,factor)));
		    	}
		    }
		    // Down
		    else {
		    	if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(-factor,-factor,-factor)));
		    	}
		    }

		   	e.stopPropagation();
		   	e.preventDefault();
		   	return false;
		});

		if(data.noOrbitControl){

			$(me.container).bind("mousemove",function (e) {
				

				if (e.buttons === 1){
					var factor = e.ctrlKey ? 50 : 5;

					var step = e.clientX > me.size.width/2 ? factor : -factor;

					var r = me.cameras.main.position.distanceTo(me.imagePlaneWrapper.imagePlane.position);
					
					if(e.clientX > me.size.width/2) {

						me.cameras.main.position.x += factor;
					}
					else {
						me.cameras.main.position.x -= factor;
					}

					me.cameras.main.lookAt(me.imagePlaneWrapper.imagePlane.position);
				}
			});

			// Click ?
			$(me.container).on('click', function(e){
				//console.log(e);
			});

		}

		data.container.append(me.container);

		me.initThree();
	},
	initThree : function(){
		var me = this;
		THREE.ImageUtils.crossOrigin = "anonymous"; 

		me.renderer = new THREE.WebGLRenderer();

		me.cameras.main = new THREE.PerspectiveCamera(
			me.VIEW_ANGLE,
			me.aspect,
			me.NEAR,
			me.FAR
		);

		me.scenes.main = new THREE.Scene();


		var controls = new THREE.OrbitControls( me.cameras.main , me.orbitContainer || document);


		me.scenes.main.add(me.cameras.main);

		me.cameras.main.position.z = me.CAMERA_Z;

		me.renderer.setSize(me.size.width, me.size.height);

		me.container.append(me.renderer.domElement);

		var pointLight = new THREE.PointLight(0xFFFFFF);

		// set its position
		pointLight.position.x = 0;
		pointLight.position.y = 0;
		pointLight.position.z = 3000;

		me.defineImagePlane({path : me.defaultImage}, function(){
			if(me.SQUARE_ENTITY_MODE){
				
				me.grid = new Grid({
					step : me.gridStep,
					imagePlaneWrapper : me.imagePlaneWrapper
				});

				me.initSquaredEntities({count : me.count});
			
			}
			else {
				me.initEntities({count : me.count});
			}
			

			
			
		});

		// add to the scene
		me.scenes.main.add(pointLight);
	},
	initEntities : function(data){
		var me = this;

		for(var i = 0; i < data.count; ++i){

			var inc = new Entity.random.constructor({cube : true});

			var vec = me.getRandomPositionInImagePlane(inc.object.position.z);

			inc.object.position.x = vec.x;
			inc.object.position.y = vec.y;

			me.entitiesManager.add(inc);
			me.scenes.main.add(inc.object);
			me.geneticsManager.add(inc);
		}
	},
	initSquaredEntities : function(data){
		var me = this;
		// 1011111001111101 - 48765 - NAZII

		var fn = function(count) {
			if(count <= 0)
				return;

			var inc = new Entity.squared({
				speed : Math.floor(Math.random() * (me.MAX_SPEED - me.MIN_SPEED + 1)) + me.MIN_SPEED,
				depth : Math.floor(Math.random() * (me.MAX_DEPTH - me.MIN_DEPTH + 1)) + me.MIN_DEPTH,
				squareWidth : me.gridStep,
				squareHeight : me.gridStep,
				color : new THREE.Color(Math.random(),Math.random(),Math.random()), 
				matrix : {
					col : 4,
					row : 4,
					intMatrix : Datas.cubesByInt[Math.floor(Math.random() * Datas.cubesByInt.length)],
				},
				headColor : new THREE.Color(1.0, 1.0, 1.0),
			});


			var slot = me.grid.getRandomSlot();
			
			me.addSquareEntity(inc, {destination : new THREE.Vector3(slot.threeX, slot.threeY, 0)});

			setTimeout(function(){
				fn(--count);
			}, me.startDelay);
		}

		fn(data.count);
	},
	reset : function(newParams){
		console.log("newParams : ", newParams);
		this.Z_STEP = 0.1;
		/* Setting new parmas*/
		Entity.random.defineRandomValues(newParams);

		/* Reset */
		for (var k in this.entitiesManager.entities) {
			this.scenes.main.remove(this.entitiesManager.entities[k].object);
		}

		this.entitiesManager.clear();

		delete this.geneticsManager.selection;

		this.geneticsManager.selection = {};

		this.initEntities({count : newParams.count || this.count});
	},
	/*
	# Entities Actions
	*/
	addSquareEntity : function(entity, options){
		this.grid.addSquaredEntityByCoor(entity, true);

		entity.pushIntoScene(this.scenes.main);

		var destination = options && options.destination ? options.destination : new THREE.Vector3(0,0,0);

		destination.z = this.Z_GAP + (++this.Z_STEP);
		

		this.entitiesManager.add(entity);

		entity.destination = destination;

	},
	executeActions : function (actions){
		//console.log(actions);
		if(!actions){
			return;
		}
		// # Remove
		if(actions.remove){
			for (var i = 0, len = actions.remove.length; i < len; ++i) {
				
				this.grid.removeSquaredEntityByCoor(actions.remove[i], true);

				actions.remove[i].removeFromScene(this.scenes.main);

				this.entitiesManager.remove(actions.remove[i]);

			}
		}

		// # Add
		if(actions.add){
			for (var i = 0, len = actions.add.length; i < len; ++i) {
				
				this.addSquareEntity(actions.add[i], {destination: actions.add[i].destination});
				/*
				this.grid.addSquaredEntityByCoor(actions.add[i], true);

				actions.add[i].pushIntoScene(this.scenes.main);

				this.entitiesManager.add(actions.add[i]);

				
				console.log("add");
				*/
			}
		}

		// # Move
		if(actions.move){
			for (var i = 0, len = actions.move.length; i < len; ++i) {
				
				this.grid.removeSquaredEntityByCoor(actions.move[i]);

				var inc = this.grid.getRandomSlot();
				
				actions.move[i].destination = new THREE.Vector3(
					inc.threeX, inc.threeY, actions.move[i].getPosition().z
				);

			
			}
		}

		// # Validate
		if(actions.validate){
			for (var i = 0, len = actions.validate.length; i < len; ++i) {
				
				//this.grid.removeSquaredEntityByCoor(actions.validate[i]);
				
				actions.validate[i].oldPosition = new THREE.Vector3( 
					actions.validate[i].getPosition().x,
					actions.validate[i].getPosition().y,
					actions.validate[i].getPosition().z
				);

				actions.validate[i].onValidation = true;

				actions.validate[i].destination = new THREE.Vector3(
					actions.validate[i].getPosition().x, actions.validate[i].getPosition().y, 0
				);

			}
		}

		// # Remove (Square)
		if (actions.removeSquares){
			for (var i = 0, len = actions.removeSquares.length; i < len; ++i) {
				
				--this.grid.entitiesCases;
				
				this.scenes.main.remove(actions.removeSquares[i].object);
			}
		}

	},
	getRandomPositionInImagePlane : function(z){
		var rdmX = Math.floor((Math.random()*(this.imagePlaneWrapper.rect.bottomRight.x*2))),
			rdmY = Math.floor((Math.random()*(this.imagePlaneWrapper.rect.topLeft.y*2)));


		return new THREE.Vector3(
			rdmX - this.imagePlaneWrapper.rect.bottomRight.x,
			rdmY - this.imagePlaneWrapper.rect.topLeft.y,
			z
		);
	},
	// Doesnt work with negative range .. (as -10 -> 10).
	getRandomPositionInRect : function(rect, z){
		return new THREE.Vector3(
			Math.floor(Math.random() * (rect.topLeft.x - rect.bottomRight.x + 1)) + rect.topLeft.x,
			Math.floor(Math.random() * (rect.bottomRight.y - rect.topLeft.y + 1)) + rect.bottomRight.y,
			z
		);
	},
	getPixelColor : function(coor){
		return this.imagePlaneWrapper.hiddenCanvas.getPixel(this.imagePlaneWrapper.imagePlane , coor);
	},
	getSquare : function(entity, size){
		return this.imagePlaneWrapper.hiddenCanvas.getSquare(this.imagePlaneWrapper.imagePlane, entity, size);
	},
	getSquareColor : function(entity, size){
		return this.imagePlaneWrapper.hiddenCanvas.getSquareColor(this.imagePlaneWrapper.imagePlane, entity, size);
	},
	calculatePopulationFitness : function (){
		var fakeEntity = new Entity.random(),
			required = (this.imagePlaneWrapper.hiddenCanvas.img.width * this.imagePlaneWrapper.hiddenCanvas.img.height) / (fakeEntity.MIN_WIDTH * fakeEntity.MAX_WIDTH);
		
		return (required*2) - this.entitiesManager.count;
	},
	defineImagePlane : function(data, callback){
		var me = this;

		if(me.imagePlaneWrapper.imagePlane){
			me.scenes.main.remove(me.imagePlaneWrapper.imagePlane);
			me.imagePlaneWrapper.imagePlane = null;
		}

		me.imagePlaneWrapper.hiddenCanvas.loadImage(data.path, function (hiddenCanvas){

			// Parmas : url , mapping , onLoad, onError
			var srcImg = THREE.ImageUtils.loadTexture(data.path, null, 
				function(onLoad) {
					console.log("onLoad : ", onLoad);
				},
				function(onError) {
					console.log("onError : ", onError);
				}
			);
			srcImg.src = data.path;
			//srcImg.image = hiddenCanvas.img;

			srcImg.crossOrigin = "anonymous";
			srcImg.minFilter = THREE.LinearFilter;
			
			var imgTex = new THREE.MeshBasicMaterial({
				map:srcImg,
			});

   			imgTex.needsUpdate = true;
			imgTex.minFilter = THREE.LinearFilter;

			// PlaneGeometry - PlaneBufferGeometry
			me.imagePlaneWrapper.imagePlane = new THREE.Mesh(
				new THREE.PlaneBufferGeometry(hiddenCanvas.img.width, hiddenCanvas.img.height),
				imgTex
			);

			me.imagePlaneWrapper.rect = {
				width : hiddenCanvas.img.width,
				height :  hiddenCanvas.img.height,
				topLeft : {
					x : -( parseInt(hiddenCanvas.img.width/2) ),
					y : ( parseInt(hiddenCanvas.img.height/2) ),
				},
				bottomRight : {
					x : ( parseInt(hiddenCanvas.img.width/2) ),
					y : -( parseInt(hiddenCanvas.img.height/2) ),
				}
			}

			me.imagePlaneWrapper.imagePlane.overdraw = true;
			me.scenes.main.add(me.imagePlaneWrapper.imagePlane);

			if(callback)
				callback();
			
		});
	},
	// TO USE
	changeFramerate : function(time){
		var me = this;
		me.stop();
		me.time = time;
		me.start();
	},
	speedUp : function(){
		this.entitiesSpeedFactor *=2 ;
	},
	slowDown : function(){
		this.entitiesSpeedFactor /= 2;
	},
	pause : function(){
		if (this.paused){
			this.start();
		}
		else {
			this.stop();
		}
	},
	start : function(){
		this.paused = false;
		this.render();
	},
	stop : function(){
		this.paused = true;
	},
	render: function(){
		var me = this,
			fakeVector = new THREE.Vector3(0,0,0);

		function run () {

			if(me.paused)
				return;

			// ref :
			// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
			requestAnimationFrame(run);


			for( var key in me.entitiesManager.entities){

				for(var i = 0, len = me.entitiesManager.entities[key].actions.continuous.length; i<len; ++i ){
					me.entitiesManager.entities[key].actions.continuous[i](me);
				}

				if(me.entitiesManager.entities[key].destination){

					var vec = fakeVector.subVectors(
						me.entitiesManager.entities[key].destination,
						me.entitiesManager.entities[key].getPosition()
					);

					if( (me.entitiesManager.entities[key].speed * me.entitiesSpeedFactor) >= me.entitiesManager.entities[key].destination.distanceTo(me.entitiesManager.entities[key].getPosition())){
						me.entitiesManager.entities[key].setPosition(me.entitiesManager.entities[key].destination);
						me.entitiesManager.entities[key].onDestinationReach(me, me.entitiesManager.entities[key].destination);
						me.entitiesManager.entities[key].destination = null;

					}
					else {
						me.entitiesManager.entities[key].add(
							vec.normalize().multiply(
								new THREE.Vector3(
									me.entitiesManager.entities[key].speed * me.entitiesSpeedFactor,
									me.entitiesManager.entities[key].speed * me.entitiesSpeedFactor,
									me.entitiesManager.entities[key].speed * me.entitiesSpeedFactor
								)
							)
						);
					}
				}

				if (me.entitiesManager.entities[key].destinationColor){
					
					me.entitiesManager.entities[key].getColor().lerp()
				}
			}

			if(me.evaluateMode){
				me.geneticsManager.fastEvaluation();
			}

			me.renderer.render(me.scenes.main, me.cameras.main);
		}

		run();
	}

}




// shim layer with setTimeout fallback
/*
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
	};
})();
*/