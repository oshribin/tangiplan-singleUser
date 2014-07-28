Tasks = Backbone.Collection.extend({
	
	localStorage: new Backbone.localStorage("Tasks"),

	model: task,


});

var taskList = new Tasks;
