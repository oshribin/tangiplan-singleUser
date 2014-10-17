var CheckList_page = Backbone.View.extend({
	template: Handlebars.compile($("#checkList").html()),

	events:{
		"click .render" : "render",
		"click .home" : "home",
		"click .end" : "end"
	},

	home: function(){
		router.navigate("",true);
	},

	end: function(){
		var now = Date.now();
		this.model.save({actGoOut:now}, {success:this.home});
	},

	render: function(){
		this.model.clUsageInc();
		taskList.fetch({success:this.build});
	},




	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"מעקב בוקר"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.build = _.bind(this.build,this);
		taskList.fetch({success:this.build});
	},

	build: function(){
		this.$(".checkList").html("");
		this.checked = _.chain(taskList
			.where({userid:this.model.get("_id"),checked:true}));


		var _iterator = function(task){
			var x = task.get("lastDate") != null ? Date.parse(task.get("lastDate")) : 0;
				return x;
		};

		var sortChecked = _.chain(this.checked).sortBy(_iterator);


		sortChecked.each(function(task){
			var oneView = new checkTask({model:task});
				this.$(".checkList").append(oneView.render().el);
			var exFreeTime = task.get("exFreeTime");
			if(exFreeTime)
				this.$(".checkList").append("<li class='row'><span class='label label-default col-xs-12'>זמן בין המשימות - "+ exFreeTime + "</spanv></li>");
		});
	}
			



});