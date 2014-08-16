var MatchObjectView_page = Backbone.View.extend({

	template: Handlebars.compile($("#matchTasks").html()),

	events:{
		"click .next":"next",
	},

	next: function(){

		var flag = this.validate();
		if(flag)
			router.navigate("set_durations", true);
		else
			alert("יש מסימות שעדיין לא משויכות לאוביקט");
	},

	validate: function(){
		var flag = true;
		_.chain(this.checked).each(function(task){
			if(task.get("objectId") == null)
				flag = false
		});
		return flag;

	},

	build: function(){
		this.checked = taskList.where({checked:true});
		_.chain(this.checked).each(function(task){
		var oneView = new MatcheObjectView_single({model:task});
		this.$(".matchList").append(oneView.render().el);	

		});

	},

	initialize: function (){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"התאם אובייקט למשימה"});
		this.$el.html(title);
		this.$el.append(this.template);
		taskList.fetch({success: this.build});

	}, 


});
