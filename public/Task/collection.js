Tasks = Backbone.Collection.extend({
	
	//localStorage: new Backbone.localStorage("Tasks"),
    url: "/api/tasks",
	model: Task


});

var taskList = new Tasks;
