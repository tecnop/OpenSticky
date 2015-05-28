var ThreeWrapper = function (data){
	this.inject(data);
}
ThreeWrapper.prototype  = {
	// Camera attributes
	VIEW_ANGLE : 45,
	NEAR : 0.1,
	FAR : 10000,
	inject : function(data){
		var me = this;

		

		
		me.size = data.size || {width : 800, height : 600};

		me.container = $('<div style="width:' + me.size.width + 'px;height:' + me.size.height + 'px;">');

		me.time = 60;

		me.aspect = me.size.width / me.size.height;
		me.scenes = {};
		me.cameras = {};

		data.container.append(me.container);

		me.initThree();
	},
	initThree : function(){
		var me = this;

		//

		// shim layer with setTimeout fallback
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
			};
		})();

		//


		me.renderer = new THREE.WebGLRenderer();

		me.cameras.main = new THREE.PerspectiveCamera(
			me.VIEW_ANGLE,
			me.aspect,
			me.NEAR,
			me.FAR
		);

		me.scenes.main = new THREE.Scene();


		me.scenes.main.add(me.cameras.main);

		me.cameras.main.position.z = 300;

		me.renderer.setSize(me.size.width, me.size.height);

		me.container.append(me.renderer.domElement);

		// DELME ZONE

		var radius = 50,
		    segments = 16,
		    rings = 16;

		var sphereMaterial = new THREE.MeshLambertMaterial(
			{
				color: 0xCC0000
			}
		);

		var sphere = new THREE.Mesh(
		  new THREE.SphereGeometry(
		    radius,
		    segments,
		    rings),
		  sphereMaterial);

		// add the sphere to the scene
		me.scenes.main.add(sphere);

		me.sphere = sphere;

		var pointLight = new THREE.PointLight(0xFFFFFF);

		// set its position
		pointLight.position.x = 10;
		pointLight.position.y = 50;
		pointLight.position.z = 130;

		// add to the scene
		me.scenes.main.add(pointLight);

		me.start();

	},
	fakeMove : function(){
		this.sphere.position.x += 100;
	},
	speedUp : function(){
		this.time =this.time > 1000 ? this.time - 100 : 
						this.time > 100 ? this.time - 10 :
							this.time > 10 ? this.time - 1 : 1;

	},
	// TODO
	slowDown : function(){

	},
	// TO USE
	changeFramerate : function(time){
		var me = this;
		me.stop();
		me.time = time;
		me.start();
	},
	// ref :
	// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	start : function(){
		var me = this;

		if(me.mainLoop)
			return;

		
		me.mainLoop = setInterval(me.render(me), me.time);
	},
	stop : function(){
		var me = this;

		if(me.mainLoop){
			clearInterval(me.mainLoop);
		}
	},
	render : function(context){
		//requestAnimFrame(animloop);
		context.renderer.render(context.scenes.main, context.cameras.main);
	}
}