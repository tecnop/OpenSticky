/*
# Data's  :
	context <ThreeWrapper>,
	keys : [
		{
			key <char>,
			action <function>	
		},
	]
*/
var InputsListeners = function(data){
	this.init(data);
};
InputsListeners.prototype = {
	CHARS : {
		// a-z
		'97': 'a',
		'98': 'b',
		'99': 'c',
		'100': 'd',
		'101' : 'e',

		'102' : 'f',
		'103' : 'g',
			'71' : 'G',
		'104' : 'h',
			'72' : 'H',
		'105' : 'i',
		'106' : 'j',

		'107' : 'k',
		'108' : 'l',
		'109' : 'm',
		'110' : 'n',
		'111' : 'o',
		'112' : 'p',
		'113' : 'q',
		'114' : 'r',
		'115' : 's',
		'116' : 't',
		'117' : 'u',
		'118' : 'v',
		'119' : 'w',
		'120' : 'x',
		'121' : 'y',
		'122' : 'z',
		// Special
		'43': 'plus',
		'45': 'minus',
	},
	init : function(data){
		var me = this;
		me.keys = data.keys;
		me.context = data.context;
		$(document).on("keypress", function(e){
			if(me.keys[me.CHARS[e.charCode]+""]){
				me.keys[me.CHARS[e.charCode]+""](me.context,e);
			}
		});

		
	}
}
