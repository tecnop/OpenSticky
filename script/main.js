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

				var res = three.testEntity.actions[0](three);
				if(res && res.length >= 3){
					three.testEntity.setColor(new Color.decimal(res[0],res[1],res[2]));
				}

			},
			'y' : function(three){

				var col = three.testEntity.actions[1](three);

				if (col) {
					three.testEntity.setColor(col);
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



