/*
# ALL Components implt this interface :
	
	<string> buildStyles(void);
	
*/

var Components = {

	DragAndDrod : function(data){
		this.inject(data);
	},
	injectCss : function() {
		
		for (var key in this) {

			if(key === 'injectCss')
				return;

			$("head").find("style").append(this[key].buildStyles());
			
		}
	}
}


Components.DragAndDrod.prototype = {
	WIDTH : 200,
	HEIGHT : 200,
	SUPPORTED_FILE_FORMAT : [
		{
			browserType : 'application/vnd.ms-excel',
			ext : 'xls',
		},
	],
	inject : function(data, options) {
		var me = this;

		me.styles = me.buildStyles({
			inject : true,
		});

		me.listeners = data.listeners;
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

		me.message.html("Drop a file");

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

		if (options) {

			
		}

		me.message.html(htmlMsg);
	},
	loadFile : function(data, options, callback){
		var me = this,
			err = null,
			file = data.file;


		if (file) {

			var valid = false;

			for(var i = 0, len = me.SUPPORTED_FILE_FORMAT.length; i < len; i++){
				if (me.SUPPORTED_FILE_FORMAT[i].browserType == file.type){
					valid = true;
					file.ext = me.SUPPORTED_FILE_FORMAT[i].ext;
					break;
				}
			}

			if (!valid) {
				err = "File format '" + file.type + "' is not supported. Please upload only Excel file family (.xls, .xlsx, .ods)";
				callback(err,null);
			} else {
				

				var reader = new FileReader();

	            reader.onload = function(rEvent) {

	            	// # rEvent.target.result value :
	            	// - "data:application/vnd.oasis.opendocument.spreadsheet;base64,UEsDBAoAA (... Data ...)"
	            	var textData = (rEvent.target && rEvent.target.result) ? rEvent.target.result.split(',')[1] : null;
	            	 
	            	if (!textData) {
	            		consoleWrapper.html("Parsed file is corrupted. Please check file, and upload it again.");
	            		return;
	            	}
	            	
	            	me.loadedFile = {
	            		'file' : file,
	            		textData : textData,	
	            	};

	            	callback(null, me.loadedFile);
	            };

	            reader.readAsDataURL(file); 
			}

		} else {
			callback("File not found or doesnt exists.", null);
		}
	}
}


dragNdrop.inject({
	container : dragNdropWrapper,
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

				if(e.originalEvent.dataTransfer.files.length) {

					console.log("item droped ", e.originalEvent.dataTransfer.files[0]);
					e.preventDefault();
					e.stopPropagation();
					
					item.setText("Loading ..");

					fileManager.loadFile({
						file : e.originalEvent.dataTransfer.files[0],

					},null, function(err, data){
						
						if( err ){
							item.message.addClass("hover-fail");
							item.container.addClass("hover-fail");
							item.setText(">8 [");

							consoleWrapper.html(err);

							return false;
						} 

						item.setText(data.file.name);

						item.container.removeClass("hover-fail");
						item.container.addClass("hover-win");
						
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