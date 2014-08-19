var SetDuration_page = Backbone.View.extend({

	template: Handlebars.compile($("#setDurations").html()),

	events:{
		"click .next":"save",
		"click .btn" : "modal"
	},

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"הגדר זמנים למשימה"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.build = _.bind(this.build, this);
		taskList.fetch({success:this.build});

	},

	modal: function(){
		this.$(".checkList").html("");
		var lastTask = taskList.filter(function(task){
			return ((Date.parse(task.get("lastDate"))+86400000) > Date.now());
		});
		if(lastTask == [])
			this.$(".checkList").append("לא קיימות משימות שהסתיימו ב-24 שכות האחרונות");
		else{
			_.chain(lastTask).each(function(task){
				var oneView = new checkDuration({model:task});
				this.$(".checkList").append(oneView.render().el);
			});
		}
		

	},

	build: function(){
		var singleViews = [];
		var checked = taskList.where({checked:true});
		_.chain(checked).each(function(task){
			var oneView = new SetDuration_single({model:task});
			singleViews.push(oneView);
			this.$(".setList").append(oneView.render().el);
			if (task != checked[checked.length -1])
				this.$(".setList").append("<li><span class='label label-default col-md-12'>01:00</span></li>");

		});
		this.singleViews = singleViews;
	},

	save:function(){
		this.singleViews.forEach(function(view){
			view.save();
		});

	}
});