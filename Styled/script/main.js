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
				three.entities[three.entities.length-1].add(new THREE.Vector3(0, three.gridStep, 0));
			},
			's' : function(three){
				three.entities[three.entities.length-1].add(new THREE.Vector3(0, -three.gridStep, 0));
			},
			'q' : function(three){
				three.entities[three.entities.length-1].add(new THREE.Vector3(-three.gridStep, 0, 0));
			},
			'd' : function(three){
				three.entities[three.entities.length-1].add(new THREE.Vector3(three.gridStep, 0, 0));
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
			't' : function(three) {
				three.executeActions(new Actions( {validate : [three.entitiesManager.last] } ) );
			},
			'y' : function(three) {
				console.log(three.grid.gridToString());
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

				if(three.entitiesManager.last.old){
					three.entitiesManager.last.destination = new THREE.Vector3(1,1,1);
					
					three.entitiesManager.last.destination.copy(three.entitiesManager.last.old);

					delete three.entitiesManager.last.old;
				}
				else {
					three.entitiesManager.last.old = new THREE.Vector3(1,1,1);
					three.entitiesManager.last.old.copy(three.entitiesManager.last.getPosition());

					three.entitiesManager.last.destination = new THREE.Vector3(
					three.entitiesManager.last.getPosition().x, 
					three.entitiesManager.last.getPosition().y,
					0);
				}
			
			}
		}
	});

	var drag = new Componentz.DragAndDrod.constructor({
		container : $('#row1'),
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
	MIN_SPEED : 1,
	MAX_SPEED : 25,
	MIN_DEPTH : 300,
	MAX_DEPTH : 300,
	MIN_OPACITY : 0.5,
	MAX_OPACITY : 0.8,	
	*/

	/*
	# Row 2
	*/
	var countBox = new Componentz.InputBox.constructor({
		container : $('#row2'),
		width : 180,
		item : {
			label : "Count",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inlineBlock : true,
			hideTypeInLabel : true,
		},
		defaultValue : "1000",
		helpers : {
			step : 50,
			max : 5000,
			min : 1,
		}
	});


	var minWidthBox = new Componentz.InputBox.constructor({
		container : $('#row2'),
		width : 180,
		item : {
			label : "Min Width",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inlineBlock : true,
			hideTypeInLabel : true,
		},
		defaultValue : "2",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});

	var maxWidthBox = new Componentz.InputBox.constructor({
		container : $('#row2'),
		width : 180,
		item : {
			label : "Max Width",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inlineBlock : true,
			hideTypeInLabel : true,
		},
		defaultValue : "16",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});

	var minHeightBox = new Componentz.InputBox.constructor({
		container : $('#row2'),
		width : 180,
		item : {
			label : "Min Height",
			description : "number of entities",
			dataType : "uinteger",
	 		required : true,
		},
		options : {
			inlineBlock : true,
			hideTypeInLabel : true,
		},
		defaultValue : "2",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});

	var maxHeightBox = new Componentz.InputBox.constructor({
		container : $('#row2'),
		width : 180,
		item : {
			label : "Max Height",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inlineBlock : true,
			hideTypeInLabel : true,
		},
		defaultValue : "16",
		helpers : {
			step : 2,
			max : 128,
			min : 2,
		}
	});
	/*
	# Row 3
	*/
	var minDepthBox = new Componentz.InputBox.constructor({
		container : $('#row3'),
		width : 180,
		item : {
			label : "Min Depth",
			description : "depth of entities (z axes)",
			dataType : "uinteger",
			required : false,
		},
		options : {
			inlineBlock : true
		},
		defaultValue : "1",
		helpers : {
			round : 1,
			step : 1,
			max : 500,
			min : 1,
		}
	});

	var maxDepthBox = new Componentz.InputBox.constructor({
		container : $('#row3'),
		width : 180,
		item : {
			label : "Max Depth",
			description : "depth of entities (z axes)",
			dataType : "uinteger",
			required : false,
		},
		options : {
			inlineBlock : true
		},
		defaultValue : "1",
		helpers : {
			round : 1,
			step : 1,
			max : 500,
			min : 1,
		}
	});

	var minZstepBox = new Componentz.InputBox.constructor({
		container : $('#row3'),
		width : 180,
		item : {
			label : "Min Z Step",
			description : "distance (z axes) between objects",
			dataType : "float",
			required : false,
		},
		options : {
			inlineBlock : true
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
		container : $('#row3'),
		width : 180,
		item : {
			label : "Max Z Step",
			description : "distance (z axes) between objects",
			dataType : "float",
			required : false,
		},
		options : {
			inlineBlock : true
		},
		defaultValue : "0.3",
		helpers : {
			round : 2,
			step : 0.1,
			max : 1000,
			min : 0.1,
		}
	});


	var button = new Componentz.Button.constructor({
		container : $('#row1'),
		width : 60,
		height : 30,
		label : "Go !",
		action : function(e, item){
			three.reset({
				count : countBox.getValue(),
				MIN_WIDTH : minWidthBox.getValue(),
				MAX_WIDTH : maxWidthBox.getValue(),
				MIN_HEIGHT : minHeightBox.getValue(),
				MAX_HEIGHT : maxHeightBox.getValue(),
				/*MIN_Z_STEP : minZstepBox.getValue(),
				MAX_Z_STEP : maxZstepBox.getValue(),*/
				MIN_DEPTH : minDepthBox.getValue(),
				MAX_DEPTH : maxDepthBox.getValue()

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

