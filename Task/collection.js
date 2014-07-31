Tasks = Backbone.Collection.extend({
	
	//localStorage: new Backbone.localStorage("Tasks"),

	model: Task,


});

var taskList = new Tasks;
