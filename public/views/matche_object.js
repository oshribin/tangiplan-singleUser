var MatchObjectView_page = Backbone.View.extend({

	template: Handlebars.compile($("#matchTasks").html()),

	build: function(){
		var checked = taskList.where({checked:true});
		_.chain(checked).each(function(task){
		var oneView = new MatcheObjectView_single({model:task});
		this.$(".matchList").append(oneView.render().el);	

		});

	},

	initialize: function (){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"התאם אובייקט למשימה"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.listenToOnce(taskList, "add", this.build);
		taskList.fetch();
	}, 


});
