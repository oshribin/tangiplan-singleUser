Tasks = Backbone.Collection.extend({
	
    url: "/tasks",
	model: Task


});

var taskList = new Tasks;

