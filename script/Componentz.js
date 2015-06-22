/*
# ALL Components implt this interface :
	
	NAME : {
		constructor : function(data),
		injectCSS : function(),
	}

*/

var Componentz = {
	/*
	# 1
	*/
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
	/*
	# 2
	*/
	InputBox : {
		constructor : function(data){
			this.inject(data);
		},
		injectCSS : function(){
			var cssArray = [
				'.input-button {',
					'cursor : pointer;',
					'background-color : #EEE;',
					'border : 1px solid #CCC;',
					'width : 20px;',
					'height : 20px;',
					'display : inline-block;',
					'line-height : 20px;',
					'text-align : center;',
					'font-weight : 600;',
					'margin : 2px;',
				'}',

				'.input-button:hover {',
					'background-color : #FFF;',
				'}',

				'.input-button.activeplus {',
					'background-color : #CEC;',
					'border : 1px solid #EEE;',
				'}',

				'.input-button.activeminus {',
					'background-color : #ECC;',
					'border : 1px solid #EEE;',
				'}',
			]

			return cssArray.join('');
		}
	},
	/*
	# 3
	*/
	Button : {
		constructor : function(data){
			this.inject(data);
		},
		injectCSS : function(){
			var res = [
				'.default-button {',
					'background-color : #EEE;',
					'border : 1px solid #CCC;',
					'text-align : center;',
					'font-weight : 600;',
				'}',
			];

			return res.join('');
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

/*
# 1
*/
Componentz.DragAndDrod.constructor.prototype = {
	inject : function(data, options) {
		var me = this;
		me.listeners = data ? data.listeners : {};
		data.container.append(me.buildComponent());

		
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


/*
# 2
*/
Componentz.InputBox.constructor.prototype = {
	/*
	# Data :
		container :configNameInput,
		width : 180,
		item : {
			label : "Name",
			description : "osef",
			dataType : "string",
			required : true,
		},
		options : {
			inline : false
		}
	*/
	inject : function(data) {
		var me = this;

		me.item = data.item;

		var name = (me.dataType[me.item.dataType]) ? 
			me.dataType[me.item .dataType].getLabel(me.item.label) : 
			me.dataType['default'].getLabel(me.item.label);

		me.container = jQuery('<div style="' + me.getStyles(data) + '">');

		me.label = jQuery('<div style="text-align:center; font-family: Consolas; padding-bottom: 5px;">');

		me.label.html(name);

		me.input = jQuery('<input style="width : 100%; text-align:center;" type="text" title="' + (me.item.description || "") + '">');

		me.input.val( data.defaultValue || "");

		if(data.events && data.events.onValidation) {
			me.onValidation = data.events.onValidation;
		}
		
		me.input.on('focusout', function(e) {

			var value = me.tryGetValue();

			if (value){
				
				if(me.onValidation) {
					me.onValidation(me, value);
				}

				me.input.css('background-color', '#CFC');
			}
			else {
				me.input.css('background-color', '#FCC');
			}
		});

		me.container.append(me.label);

		if (data.helpers){
			me.helpers = data.helpers;

			
			/* [+] */
			me.plusButton = jQuery('<div class="input-button"> + </div>');
			me.plusButton.on('mousedown', function(e){
				me.plusButton.addClass('activeplus');
			});
			me.plusButton.on('mouseup' , function(e){
				me.plusButton.removeClass('activeplus');
			});
			me.plusButton.on('mouseleave', function(e){
				me.plusButton.removeClass('activeplus');
			})
			me.plusButton.on('click', function(e){
				var val = me.parseValue();
				

				val = val + me.helpers.step <= me.helpers.max ? val + me.helpers.step : me.helpers.max;


				
				me.input.val(Number((val).toFixed(me.helpers.round || 1)));
			});

			/* [-] */
			me.minusButton = jQuery('<div class="input-button"> - </div>');

			me.minusButton.on('mousedown', function(e){
				me.minusButton.addClass('activeminus');
			});
			me.minusButton.on('mouseleave', function(e){
				me.minusButton.removeClass('activeminus');
			});
			me.minusButton.on('mouseup' , function(e){
				me.minusButton.removeClass('activeminus');
			});
			me.minusButton.on('click', function(e){
				var val = me.parseValue();

				val = val - me.helpers.step > me.helpers.min ?  val - me.helpers.step : me.helpers.min;

				me.input.val(Number((val).toFixed(me.helpers.round || 1)));
			});


			var wrapper = jQuery('<div style="width: 52px; margin-right : auto; margin-left:auto;">');
			
			wrapper.append(me.minusButton);
			wrapper.append(me.plusButton);
			

			me.container.append(wrapper);
		}

		me.container.append(me.input);

		data.container.append(me.container);
	},
	getStyles : function(data){
		var arr = [
			'margin-right : 3px;',
			'margin-bottom : 3px;',
			'border: 1px solid #ccc;',
			'border-radius: 3px;',
			'padding: 10px;',
			'min-width: 150px;',
			'width :' + data.width + 'px;',
			'background-color : #' + (data.item.required ? "FFE8B9" : "F4F4F4" ) + ';', // FF9933 : Orange/Yellow
			'font-size:14px;',
		];

		if (data.options && data.options.inlineBlock) {
			arr.push('display : inline-block;');
		}

		return arr.join('');
	},
	tryGetValue : function() {
		var me = this,
			choosenOne = (me.dataType[me.item.dataType] ? me.dataType[me.item.dataType] : me.dataType['default']),
			value = me.input.attr("value");

		return (value && choosenOne.isValid(value.replace(/[ ]/g, ""))) ? value : null;

	},
	parseValue : function() {
		var me = this,
			choosenOne = (me.dataType[me.item.dataType] ? me.dataType[me.item.dataType] : me.dataType['default']),
			value = me.input.val();

		if(!value)
			return null;

		return choosenOne.parseValue(value);

	},
	dataType : {
		'string' : {
			getLabel : function(name){
				return name + ' (<strong>String</strong>) :';
			},
			isValid : function(value){
				return value.length > 0 ? true : false;
			},
			parseValue : function(value){
				return value;
			}

		},
		'integer' : {
			getLabel : function(name){
				return name + ' (<strong>Integer</strong>) :';
			},
			isValid : function(value){
				return value.match(/^[\-]?[0-9]+$/) ? true : false;
			},
			parseValue : function(value){
				return parseInt(value);
			},
		},
		'uinteger' : {
			getLabel : function(name){
				return name + ' (<strong>Integer > 0</strong>) :';
			},
			isValid : function(value){
				return value.match(/^[0-9]+$/) ? true : false;
			},
			parseValue : function(value){
				return Math.abs(parseInt(value));
			}
		},
		'float' : {
			getLabel : function(name){
				return name + ' (<strong>Float</strong>) :';
			},
			isValid : function(value){
				return value.match(/^[0-9]+(?:[.]?[0-9]+)$/) ? true : false;
			},
			parseValue : function(value){
				return parseFloat(value);
			}
		},
		'boolean' : {
			getLabel : function(name){
				return name + ' (<strong>Boolean</strong>) :';
			},
			isValid : function(value){
				value +="";

				if (value == 'true' ||  value == '1' || value == 'false' || value == '0'){
					return true;
				}
				return false;
			},
			parseValue : function(value){
				value +="";

				if (value == 'true' ||  value == '1' || value == 'false' || value == '0'){
					return true;
				}
				return false;
			}
		},
		'default' : {
			getLabel : function(name){
				return name + ' (<strong>String</strong>) :';
			},
			isValid : function(value){
				return value.length > 0 ? true : false;
			},
			parseValue : function(value){
				return value;
			}
		}
	}
};

/*
# 3
*/
Componentz.Button.constructor.prototype = {
	inject : function(data) {
		var me = this;

		this.container = jQuery('<div class="default-button" style="width:'+data.width+'px;height : '+data.height+'px;">');
		this.action = data.action;
		this.container.on('click', function(e){
			me.action(e, me);
		});

		this.container.html(data.label);

		data.container.append(this.container);

	}
}