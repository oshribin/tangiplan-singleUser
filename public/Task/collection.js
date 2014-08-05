Tasks = Backbone.Collection.extend({
	
	//localStorage: new Backbone.localStorage("Tasks"),
    url: "tasks",
	model: Task


});

var taskList = new Tasks;

