Tasks = Backbone.Collection.extend({
	
    url: "/TangiPlan/tasks",
	model: Task


});

Users = Backbone.Collection.extend({
	url: "/TangiPlan/users",
	model: User,
})

var userList = new Users;
var taskList = new Tasks;
//creating dumy user
//var user = userList.create({name:"moosh"});

