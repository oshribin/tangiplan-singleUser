Tasks = Backbone.Collection.extend({
	
    url: "/TangiPlan/tasks",
	model: Task


});

Users = Backbone.Collection.extend({
	url: "/TangiPlan/users",
	model: User,
})




