$(document).ready(function()  {
	

	Componentz.injectStyles();



	//*
	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		paused : true,
		hiddenCanvas : document.getElementById('hidden-canvas'),
		size : {
			width : $(document).width(),
			height : $(document).height(),
		},
		
	});
	//*/

	var inputs = new InputsListeners({
		context : threeWrapper,
		keys : {
			plus : function(three){
				three.speedUp() ;
			},
			minus : function(three){
				three.slowDown() ;
			},
			'h' : function(three){
				three.imagePlaneWrapper.imagePlane.visible = !three.imagePlaneWrapper.imagePlane.visible;
			},
			'e' : function(three){
				three.evaluateMode = !three.evaluateMode;
			},
			'p' : function(three){
				three.pause();
			},
			'c' : function(three){

				for(var k in three.entitiesManager.entities){

					var col = three.entitiesManager.entities[k].actions.rules.getsquare(three);
					
			

					if(col){
						three.entitiesManager.entities[k].setColor(col);
					}
	
				}
				
			},
			'm' : function(three){

				for(var k in three.entitiesManager.entities){
					three.entitiesManager.entities[k].destination = three.getRandomPositionInImagePlane(
						three.entitiesManager.entities[k].object.position.z
					);
				}
			},
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



