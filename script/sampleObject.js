var Object = function(data) {
	this.init(data);
}

Object.prototype = {
	init : function(data){
		this.data = data;
	},
	getValue : function(values){
		return this.data;
	}
}



var obj1 = new Object("blabla"),
	obj2 = new Object("bloublou");


obj1.