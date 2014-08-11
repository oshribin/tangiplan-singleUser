var SetDuration_page = Backbone.View.extend({

	template: Handlebars.compile($("#setDurations").html()),

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"הגדר זמנים למשימה"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.listenToOnce(taskList, "add", this.build);
		taskList.fetch();

	},

	build: function(){
		var checked = taskList.where({checked:true});
		_.chain(checked).each(function(task){
			var oneView = new SetDuration_single({model:task});
			this.$(".setList").append(oneView.render().el);
			if (task != checked[checked.length -1])
				this.$(".setList").append("<li><span class='label label-default col-md-12'>01:00</span></li>");

		});
	},

});