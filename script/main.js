$(document).ready(function()  {
	
	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		size : {
			width : 800,
			height : 800,
		},
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
			's' : function(three){
				three.stop();
			},
			't' : function(three){
				three.fakeMove();
			}
		}
	});


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



