/*
# ALL Components implt this interface :
	
	<string> buildStyles(void);
	preData <map>;
*/

var Componentz = {

	DragAndDrod : {
		WIDTH : 200,
		HEIGHT : 200,
		SUPPORTED_FILE_FORMAT : [
			{
				browserType : 'image/png',
				ext : 'png',
			},
			{
				browserType : 'image/jpeg',
				ext : 'jpg',
			},
			{
				browserType : 'image/jpeg',
				ext : 'jpeg',
			},
		],
		constructor : function(data){
			this.inject(data);
		},
		injectCSS : function(){
			var me = this,
				cssArray = [
					'.dragndrop-container { width : '+me.WIDTH+'px; height : '+me.HEIGHT+'px; background-color : #EFEFEF; border : 2px dashed #CCC;cursor: cell;}',

					'.dragndrop-container.hover { background-color : #DFDFDF; border : 2px dashed #205081;}',
					
					'.dragndrop-container.hover-fail { background-color : #FFDFDF; border : 2px dashed #F00;}',

					'.dragndrop-container.hover-win { background-color : #DFFFDF; border : 2px dashed #0F0;}',

					'.dragndrop-message {',
						'-webkit-user-select: none;', /* Chrome/Safari */        
						'-moz-user-select: none;', /* Firefox */
						'-ms-user-select: none;', /* IE10+ */
						'position: relative;',
						'height: 16px;',
						'text-align: center;',
						'font-family: cursive;',
						'line-height: 16px;',
						'font-size: 16px;',
						'letter-spacing: 0.02em;',
						'top: 45%;',
						'cursor: cell;',
					'}',

					'.dragndrop-message.hover {',
						'color : #205081',
					'}',

					'.dragndrop-message.hover-fail {',
						'color : #F00',
					'}',
				];

			return cssArray.join('');
		}
	},
	injectStyles : function() {
		
		for (var key in this) {

			if(key === 'injectStyles')
				return;


			var inc = this[key];
			
			$("head").find("style").append(inc.injectCSS());
			
		}
	}
}


Componentz.DragAndDrod.constructor.prototype = {
/*	WIDTH : 200,
	HEIGHT : 200,
	SUPPORTED_FILE_FORMAT : [
		{
			browserType : 'image/png',
			ext : 'png',
		},
		{
			browserType : 'image/jpg',
			ext : 'jpg',
		},
	],*/
	inject : function(data, options) {
		var me = this;
/*		me.styles = me.buildStyles({
			inject : true,
		});*/

		me.listeners = data ? data.listeners : {};
		data.container.append(me.buildComponent());

		
	},
	// 	inject <Bool> : If 'true', will push css directly in dom.
	buildStyles : function(){
		var me = this,
			cssArray = [

			'.dragndrop-container { width : '+me.WIDTH+'px; height : '+me.HEIGHT+'px; background-color : #EFEFEF; border : 2px dashed #CCC;cursor: cell;}',

			'.dragndrop-container.hover { background-color : #DFDFDF; border : 2px dashed #205081;}',
			
			'.dragndrop-container.hover-fail { background-color : #FFDFDF; border : 2px dashed #F00;}',

			'.dragndrop-container.hover-win { background-color : #DFFFDF; border : 2px dashed #0F0;}',

			'.dragndrop-message {',
				'-webkit-user-select: none;', /* Chrome/Safari */        
				'-moz-user-select: none;', /* Firefox */
				'-ms-user-select: none;', /* IE10+ */
				'position: relative;',
				'height: 16px;',
				'text-align: center;',
				'font-family: cursive;',
				'line-height: 16px;',
				'font-size: 16px;',
				'letter-spacing: 0.02em;',
				'top: 45%;',
				'cursor: cell;',
			'}',

			'.dragndrop-message.hover {',
				'color : #205081',
			'}',

			'.dragndrop-message.hover-fail {',
				'color : #F00',
			'}',
		];

		return cssArray.join('');
	},
	buildComponent : function(data){
		var me = this;
		
		me.container = jQuery('<div class="dragndrop-container">');
		me.message = jQuery('<div class="dragndrop-message">');

		me.message.html("Drop an image");

		me.container.append(me.message);

		if (me.listeners) {

			for(var i = 0, len = me.listeners.length; i < len; i++){
				(function(index){

					me.container.on(me.listeners[index].name+"", function(e){
						e.preventDefault();
						e.stopPropagation();
						me.listeners[index].action( e, me);
						
						return false;
					});

				})(i);
				
			}
		}

		return me.container;

	},
	setText : function(text, options) {
		var me = this,
			htmlMsg = text +"";

		me.message.html(htmlMsg);
	},
	loadFile : function(data, options, callback){
		var me = this,
			err = null,
			file = data.file;


		if (file) {

			var valid = false;

			for(var i = 0, len = Componentz.DragAndDrod.SUPPORTED_FILE_FORMAT.length; i < len; i++){
				if (Componentz.DragAndDrod.SUPPORTED_FILE_FORMAT[i].browserType == file.type){
					valid = true;
					file.ext = Componentz.DragAndDrod.SUPPORTED_FILE_FORMAT[i].ext;
					break;
				}
			}

			if (!valid) {
				err = "File format '" + file.type + "' is not supported. Please upload only Excel file family (.xls, .xlsx, .ods)";
				callback(err,null);
			} else {
				

				var reader = new FileReader();

	            reader.onload = function(e) {
	
	       

	            	me.loadedFile = {
	            		'file' : file,
	            		dataURI : e.target.result
	            	};

	            	callback(null, me.loadedFile);
	            };

	            //reader.readAsArrayBuffer(file); 
	            reader.readAsDataURL(file);
			}

		} else {
			callback("File not found or doesnt exists.", null);
		}
	}
}

