var ThreeWrapper = function (data){
	this.inject(data);
}
ThreeWrapper.prototype  = {
	// Camera attributes
	VIEW_ANGLE : 45,
	NEAR : 0.1,
	FAR : 10000,
	paused : false,
	inject : function(data){
		var me = this;

		me.size = data.size || {width : 800, height : 600};
		me.imagePlaneSize = data.imagePlaneSize || {width : 800, height : 600};

		me.container = $('<div style="width:' + me.size.width + 'px;height:' + me.size.height + 'px;">');
		
		me.time = {
			lastTime : 0,
			currTime : 0,
		}

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

			// UP
			if (e.originalEvent.detail && e.originalEvent.detail <= 0)
			{
		    	if(me.cameras.main){
		    		me.cameras.main.position.z -= 5;
		    	}
		    }
		    // Down
		    else {
		    	if(me.cameras.main){
		    		me.cameras.main.position.z += 5;
		    	}
		    }

		   	
		   	e.stopPropagation();
		   	e.preventDefault();
		   	return false;

		});

		// Others
		$(me.container).bind("mousewheel",function (e) {

			// UP
			if (e.originalEvent.wheelDelta && e.originalEvent.wheelDelta >= 0){
		        if(me.cameras.main){
		    		me.cameras.main.position.z -= 5;
		    	}
		    }
		    // Down
		    else {
		    	if(me.cameras.main){
		    		me.cameras.main.position.z += 5;
		    	}
		    }

		   	e.stopPropagation();
		   	e.preventDefault();
		   	return false;
		});

		// 
		$(me.container).bind("mousemove",function (e) {
			
			if (e.buttons === 1){
				var step = e.clientX > me.size.width/2 ? 5 : -5;
				var r = me.cameras.main.position.distanceTo(me.imagePlaneWrapper.imagePlane.position);
				
				if(e.clientX > me.size.width/2) {

					me.cameras.main.position.x += 5;
				}
				else {
					me.cameras.main.position.x -= 5;
				}

				me.cameras.main.lookAt(me.imagePlaneWrapper.imagePlane.position);
			}
		});

		data.container.append(me.container);

		me.initThree();
	},
	initThree : function(){
		var me = this;
		THREE.ImageUtils.crossOrigin = "anonymous"; 
		//

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

		var pointLight = new THREE.PointLight(0xFFFFFF);

		// set its position
		pointLight.position.x = 10;
		pointLight.position.y = 50;
		pointLight.position.z = 130;

		me.defineImagePlane({path : 'img/abo.png'});

		me.testEntity = new Entity.random();

		

		// add to the scene
		me.scenes.main.add(me.testEntity.object);
		me.scenes.main.add(pointLight);


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
	/*
	# Data : {
		path : ,

	}
	*/
	defineImagePlane : function(data){
		var me = this;

		if(me.imagePlaneWrapper.imagePlane){
			me.scenes.main.remove(me.imagePlaneWrapper.imagePlane);
			me.imagePlaneWrapper.imagePlane = null;
		}

		me.imagePlaneWrapper.hiddenCanvas.loadImage(data.path, function (hiddenCanvas){
			// Parmas : url , mapping , onLoad, onError
			var srcImg = THREE.ImageUtils.loadTexture(data.path);
			srcImg.src = data.path;

			srcImg.crossOrigin = "anonymous";
			srcImg.minFilter = THREE.LinearFilter;

			var imgTex = new THREE.MeshBasicMaterial({
				map:srcImg,
				
			});

			imgTex.map.needsUpdate = true; 

			

			// plane
			me.imagePlaneWrapper.imagePlane = new THREE.Mesh(
				new THREE.PlaneGeometry(hiddenCanvas.img.width, hiddenCanvas.img.height),
				imgTex
			);

			me.imagePlaneWrapper.imagePlane.overdraw = true;
			me.scenes.main.add(me.imagePlaneWrapper.imagePlane);
		});
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
		var me = this;

		function run () {

			if(me.paused)
				return;


			// ref :
			// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
			requestAnimationFrame(run);
			
			//me.testEntity.object.rotation.z += 0.05;

			me.renderer.render(me.scenes.main, me.cameras.main);
		}

		run();
	}

}

