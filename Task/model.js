var Task = Backbone.Model.extend({
	
	defaults: function() {
		return {
			name: "",
			givDuration: null,
			exDuration:null,
			pobjectId:null,

		};
	},

});


Tasks = Backbone.Collection.extend({
	
	localStorage = new Backbone.localStorage("Tasks"),

	model: task,


});

var taskList = new Tasks;

