var Color = {
	// 0.0 -> 1.0
	float : function(r,g,b,a){
		var me = this;

		me.r = r;
		me.dr = me.floatToDecimal(r);

		me.g = g;
		me.dg = me.floatToDecimal(g);

		me.b = b;
		me.db = me.floatToDecimal(b);

		me.a = a || 1.0;
		me.da = a ?  me.floatToDecimal(a) : 255;
	},
	// 0 -> 255
	decimal : function(r,g,b,a){
		var me = this;

		me.r = me.decimalToFloat(r);
		me.dr = r;

		me.g = me.decimalToFloat(g);
		me.dg = g;

		me.b = me.decimalToFloat(b);
		me.db = b;

		me.a = a ? me.decimalToFloat(a) : 1.0;
		me.da = a || 255;
	}
}

Color.float.prototype = {
	floatToDecimal : function(value){
		return parseInt(value * 255);
	},
	decimalToFloat : function(value){
		if(value >= 0.0 && value <= 1.0)
			return value;

		if(value >= 0 && value <= 255){
			return value / 255;
		}

		return 0.0;
	},
	toHex : function(stringify){
		var r = (this.dr).toString(16).length <= 1 ? '0' + (this.dr).toString(16) : (this.dr).toString(16),
			g = (this.dg).toString(16).length <= 1 ? '0' + (this.dg).toString(16) : (this.dg).toString(16),
			b = (this.db).toString(16).length <= 1 ? '0' + (this.db).toString(16) : (this.db).toString(16);

		return stringify ? '0x' + r + g + b  : parseInt('0x' + r + g + b );
	},
	getCode : function(){
	},
	comparate : function(color){
		return (Math.abs(this.r - color.r) + Math.abs(this.g - color.g) + Math.abs(this.b - color.b)) / 3;
	}
}

Color.decimal.prototype = Color.float.prototype;