$(document).ready(function()  {
	
	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		hiddenCanvas : document.getElementById('hidden-canvas'),
		size : {
			width : $(document).width(),
			height : $(document).height(),
		},
		imagePlaneSize : {
			width : 400,
			height : 400
		}
	});

	var inputs = new InputsListeners({
		context : threeWrapper,
		keys : {
			plus : function(three){
				three.speedUpFPS() ;
			},
			minus : function(three){
				three.slowDownFPS() ;
			},
			'z' : function(three){
				three.testEntity.add({x:0,y:2,z:0});
			},
			'q' : function(three){
				three.testEntity.add({x:-2,y:0,z:0});
			},
			's' : function(three){
				three.testEntity.add({x:0,y:-2,z:0});
			},
			'd' : function(three){
				three.testEntity.add({x:2,y:0,z:0});
			},
			'p' : function(three){
				three.pause();
			},
			't' : function(three){

				for(var k in three.entitiesManager.entities){

					var col = three.entitiesManager.entities[k].actions.rules.getsquare(three);
					
			

					if(col){
						three.entitiesManager.entities[k].setColor(col);
					}
	
				}
				
			},
			'y' : function(three){

				for(var k in three.entitiesManager.entities){
					three.entitiesManager.entities[k].destination = three.getRandomPositionInImagePlane(
						three.entitiesManager.entities[k].object.position.z
					);
				}
			},
		}
	});


	threeWrapper.render();


});





// Unused !
/*
# Arrays of <string> (representing joined css for each compos)
*/
var injectCSS = function(arrays){
	var body = $("body.style");
	var head = $("head.style");



	for (var i = 0, len = arrays.length; i < len; i++ ){
		body.append(arrays [i]);
	}
}



