$(document).ready(function()  {
	

	Componentz.injectStyles();

	

	//*
	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		paused : false,
		hiddenCanvas : document.getElementById('hidden-canvas'),
		size : {
			width : $(document).width(),
			height : $(document).height(),
		},
		orbitContainer : document.getElementById( 'main-canvas' ),
		
	});
	//*/

	injectInputs($('#inputs'),threeWrapper);

	var inputs = new InputsListeners({
		context : threeWrapper,
		container :  $('#bottom-content'),
		keys : {
			plus : function(three) {
				three.speedUp();
			},
			minus : function(three) {
				three.slowDown();
			},

			'z' : function(three){
				three.inc.add(new THREE.Vector3(0, three.gridStep, 0));
			},
			's' : function(three){
				three.inc.add(new THREE.Vector3(0, -three.gridStep, 0));
			},
			'q' : function(three){
				three.inc.add(new THREE.Vector3(-three.gridStep, 0, 0));
			},
			'd' : function(three){
				three.inc.add(new THREE.Vector3(three.gridStep, 0, 0));
			},

			'h' : function(three) {
				three.imagePlaneWrapper.imagePlane.visible = !three.imagePlaneWrapper.imagePlane.visible;
			},
			'e' : function(three) {
				three.evaluateMode = !three.evaluateMode;
			},
			'p' : function(three) {
				three.pause();
			},
			'n' : function(three) {
				
				three.initSquaredEntities({count : 1});
				//three.initEntities({count : 10});

			},
			'y' : function(three) {
				console.log(three.inc.calculateFitness(three));

				/*var col = three.getSquareColor(three.inc, {width : three.inc.squareWidth, height : three.inc.squareHeight});
					
				
				if(col){
					three.inc.setColor(col);
				}*/
			},

			'g' : function(three) {
				var list = three.grid.getEntitiesList();

				for (var i = 0, len = list.length; i < len; ++i){

					three.executeActions(
						three.geneticsManager.squareEvaluationByStep(three, list[i])
					);

				}

				return;
				var next = three.grid.nextEntity();
				if(!next){
					console.warn("next is null .. cannot use genetics.");
					return;
				}

				var actions = three.geneticsManager.squareEvaluationByStep(three, next);

				three.executeActions(actions);
				//three.geneticsManager.squareEvaluation(three);
			},
			'c' : function(three) {

				for(var k in three.entitiesManager.entities){

					var col = three.entitiesManager.entities[k].actions.rules.getsquare(three);
					
			

					if(col){
						three.entitiesManager.entities[k].setColor(col);
					}
	
				}
				
			},
			'm' : function(three) {

				for(var k in three.entitiesManager.entities){
					three.entitiesManager.entities[k].destination = three.getRandomPositionInImagePlane(
						three.entitiesManager.entities[k].object.position.z
					);
				}
			},
			'r' : function (three) {

				for(var k in three.entitiesManager.entities){
					var slot = three.grid.getRandomSlot();

					three.entitiesManager.entities[k].destination = new THREE.Vector3(slot.threeX, slot.threeY, three.entitiesManager.entities[k].object.position.z); 
				}
			}
		}
	});

	var drag = new Componentz.DragAndDrod.constructor({
		container : $('#dragNdrop'),
		listeners : [
			// Must register an Event for "dragover" to ask browser to regonize file dropping 
			{
				name :"dragover",
				action : function(e, item) {}
			},
			{
				name :"dragenter",
				action : function(e, item) {
					item.message.removeClass("hover-fail");

					item.container.removeClass("hover-fail");
					item.container.removeClass("hover-win");
					item.setText("Drop a file");

					item.message.addClass("hover");
					item.container.addClass("hover");
				}
			},
			{
				name : "dragleave",
				action : function(e, item) {
					item.message.removeClass("hover");
					item.container.removeClass("hover");
				}
			},
			{
				name : "drop",
				action : function(e, item) {
					if(!e.originalEvent.dataTransfer){
						console.log("No data transfert : ", e.originalEvent);
						return false;
					}
					console.log("Drop > ", e.originalEvent);
					if(e.originalEvent.dataTransfer.files.length) {


						e.preventDefault();
						e.stopPropagation();
						
						item.setText("Loading ..");

						item.loadFile({
							file : e.originalEvent.dataTransfer.files[0],

						},null, function(err, data){
							if( err ){
								item.message.addClass("hover-fail");
								item.container.addClass("hover-fail");
								item.setText(err);

								return false;
							} 

							item.setText(data.file.name);

							item.container.removeClass("hover-fail");
							item.container.addClass("hover-win");

							threeWrapper.defineImagePlane({path:data.dataURI});
							
						});
						return false;  
	               } else {
						item.message.removeClass("hover");
						item.container.removeClass("hover");
	               } 
				}
			}
		]
	});



	threeWrapper.render();


});


var injectInputs = function(div, three){

	/*
	MIN_WIDTH : 16,
	MAX_WIDTH : 16,
	MIN_HEIGHT : 16,
	MAX_HEIGHT : 16,
	MIN_SPEED : 1,
	MAX_SPEED : 25,
	MIN_DEPTH : 300,
	MAX_DEPTH : 300,
	MIN_OPACITY : 0.5,
	MAX_OPACITY : 0.8,	
	*/

	var countBox = new Componentz.InputBox.constructor({
		container : div,
		width : 180,
		item : {
			label : "Count",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inline : true
		},
		defaultValue : "1000",
		helpers : {
			step : 10,
			max : 5000,
			min : 1,
		}
	});

	var minZstepBox = new Componentz.InputBox.constructor({
		container : div,
		width : 180,
		item : {
			label : "Min. Z Step",
			description : "number of entities",
			dataType : "float",
			required : false,
		},
		options : {
			inline : true
		},
		defaultValue : "0.3",
		helpers : {
			round : 2,
			step : 0.1,
			max : 1000,
			min : 0.1,
		}
	});

	var maxZstepBox = new Componentz.InputBox.constructor({
		container : div,
		width : 180,
		item : {
			label : "Max. Z Step",
			description : "number of entities",
			dataType : "float",
			required : false,
		},
		options : {
			inline : true
		},
		defaultValue : "0.3",
		helpers : {
			round : 2,
			step : 0.1,
			max : 1000,
			min : 0.1,
		}
	});

	var minWidthBox = new Componentz.InputBox.constructor({
		container : div,
		width : 180,
		item : {
			label : "Min Width",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inline : true
		},
		defaultValue : "2",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});

	var maxWidthBox = new Componentz.InputBox.constructor({
		container : div,
		width : 180,
		item : {
			label : "Max Width",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inline : true
		},
		defaultValue : "16",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});

	var minHeightBox = new Componentz.InputBox.constructor({
		container : div,
		width : 180,
		item : {
			label : "Min Height",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inline : true
		},
		defaultValue : "2",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});

	var maxHeightBox = new Componentz.InputBox.constructor({
		container : div,
		width : 180,
		item : {
			label : "Max Height",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inline : true
		},
		defaultValue : "16",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});

	var button = new Componentz.Button.constructor({
		container : div,
		width : 60,
		height : 30,
		label : "Go !",
		action : function(e, item){
			three.reset({
				count : countBox.tryGetValue() || 1000,
				
			});
		}
	});

}



THREE.StaticShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 },
		"amount":   { type: "f", value: 0.5 },
		"size":     { type: "f", value: 4.0 }
	},

	vertexShader: [

	"varying vec2 vUv;",

	"void main() {",

		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

	"}"

	].join("\n"),

	fragmentShader: [

	"uniform sampler2D tDiffuse;",
	"uniform float time;",
	"uniform float amount;",
	"uniform float size;",

	"varying vec2 vUv;",

	"float rand(vec2 co){",
		"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
	"}",

	"void main() {",
		"vec2 p = vUv;",
		"vec4 color = texture2D(tDiffuse, p);",
		"float xs = floor(gl_FragCoord.x / size);",
		"float ys = floor(gl_FragCoord.y / size);",
		"vec4 snow = vec4(rand(vec2(xs * time,ys * time))*amount);",

		//"gl_FragColor = color + amount * ( snow - color );", //interpolate

		"gl_FragColor = color+ snow;", //additive

	"}"

	].join("\n")

};

