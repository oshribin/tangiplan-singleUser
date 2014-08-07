var MatchObjectView_page = Backbone.View.extend({

	template: Handlebars.compile($("#matchTasks").html()),

	initialize: function (){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"התאם אובייקט למשימה"});
		this.$el.html(title);
		this.checked = taskList.where({checked:true});
		this.$el.append(this.template);
		this.build();
		
	}, 

	build: function(){
		_.chain(this.checked).each(function(task){
			var oneView = new MatcheObjectView_single({model:task});
			this.$(".matchList").append(oneView.render().el);				
		});

	},

	render: function(){

	},

});
