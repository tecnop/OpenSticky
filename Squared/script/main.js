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


			'h' : function(three, evt) {
				
				three.imagePlaneWrapper.imagePlane.visible = !three.imagePlaneWrapper.imagePlane.visible;
				
			},
			'H' : function(three, evt) {
				three.toggleEntitiesView();
			},
			'f' : function(three){
				new THREEx.FullScreen.request();
			},
			'e' : function(three) {
				/*[
					totalCases,
					currentSquares,
					missingCases,
					lockedCases
				]*/

				var res = three.grid.getGridInfos(),
					msg = [
						'# Stats : ',
						'Total Cases : ' + res[0],
						'Total Squares : ' + res[1],
						'Missing + Locked / Total: ' + res[2] + ' + ' + res[3] + ' / ' + res[0]
					]
		
				console.log(msg.join('\n'));
			},
			'p' : function(three) {
				three.pause();
			},
			'n' : function(three) {
				
				three.initSquaredEntities({count : 1});
				//three.initEntities({count : 10});

			},
			't' : function(three) {
				var squares = three.entitiesManager.last.removeSquares(1);

				three.executeActions(new Actions({removeSquares : squares}));
				//three.executeActions(new Actions( {validate : [three.entitiesManager.last] } ) );
			},
			'y' : function(three) {
				console.log(three.grid.gridToString());
			},
			'G' : function(three) {
				var list = three.grid.getEntitiesList();

				for (var i = 0, len = list.length; i < len; ++i){

					three.executeActions(
						three.geneticsManager.squareEvaluationByStep(three, list[i])
					);

				}
			},
			'g' : function(three) {

				three.geneticsMode = true;

				return;
				// TESTING ONLY
				var ent = three.grid.nextSlot().getRandomEntity();

				if(ent){
					three.executeActions(
						three.geneticsManager.squareEvaluationByStep(three, ent)
					);
				}

				return;
				// OLD OLD
				var list = three.grid.getEntitiesList();

				for (var i = 0, len = list.length; i < len; ++i){

					three.executeActions(
						three.geneticsManager.squareEvaluationByStep(three, list[i])
					);

				}
			},
			'c' : function(three) {

				
				
			},
			'm' : function(three) {

				for (var k in three.entitiesManager.entities) {
					var inc = three.grid.getRandomSlot();

					three.entitiesManager.entities[k].destination = new THREE.Vector3(
						inc.threeX,
						inc.threeY,
						three.entitiesManager.entities[k].object.position.z
					);

					three.grid.removeByMap(three.entitiesManager.entities[k], false);
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

							threeWrapper.defineImagePlane({path:data.dataURI}, function(){

								threeWrapper.grid.clearValidatedEntities(threeWrapper);
								
								threeWrapper.grid = new Grid({
									step : threeWrapper.gridStep,
									imagePlaneWrapper : threeWrapper.imagePlaneWrapper
								});

								
								//threeWrapper.initSquaredEntities({count : threeWrapper.count});
							
							});

							
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
		defaultValue : "2",
		helpers : {
			step : 50,
			max : 5000,
			min : 2,
		}
	});


	var cubeSizeBox = new Componentz.InputBox.constructor({
		container : $('#row2'),
		width : 180,
		item : {
			label : "Cube Size",
			description : "number of entities",
			dataType : "uinteger",
			required : true,
		},
		options : {
			inlineBlock : true,
			hideTypeInLabel : true,
		},
		defaultValue : "20",
		helpers : {
			step : 1,
			max : 100,
			min : 1,
		}
	});


	var button = new Componentz.Button.constructor({
		container : $('#row1'),
		width : 60,
		height : 30,
		label : "Go !",
		action : function(e, item){
			three.reset({
				count : countBox.parseValue(),
				step : cubeSizeBox.parseValue(),
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

