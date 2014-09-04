var MatchObjectView_page = Backbone.View.extend({

	template: Handlebars.compile($("#matchTasks").html()),

	events:{
		"click .next":"next",
	},

	next: function(){

		var flag = this.validate();
		if(flag){
			taskList.each(function(task){
				task.save();
			})
			router.navigate("set_durations", true);
		}
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
		_.chain(taskList.where({userid:app.user.get("_id")}))
		.each(function(task){
			task.save({objectId:null});

		});
		for (var i = 1 ; i <= 6; i++) {
			var oneView = new MatcheObjectViewV2_single({attributes:{number:i}});
			this.$(".accordion").append(oneView.render().el);
		}	


	},

	initialize: function (){
		this.checked = taskList.where({userid:app.user.get("_id"),checked:true});
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"התאם אובייקט למשימה"});
		this.$el.html(title);
		this.$el.append(this.template);
		taskList.fetch({success: this.build});
		this.$(".next");

	}, 


});
