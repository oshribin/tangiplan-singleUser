var ParentCheckList_page = Backbone.View.extend({

	template: Handlebars.compile($("#parentCheckList").html()),

	events:{
		"click .connect" : "connect",
		"click .render" : "render"
	},



	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"TangiPlan"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.$("button").hide();
		var loader = Handlebars.compile($("#loader").html());
		this.$el.append(loader);
		this.build = _.bind(this.build,this);
		app.userList.fetch();
	},

	connect: function () {
		var name = this.$(".username").val();
		var user = app.userList.findWhere({name:name});

		if(user){
			app.user = user;
			//var url = "/parentCheckList/:" + user.get("_id");
			var userid = user.get("_id");
			var that = this;
			console.log(userid);
			$.get("/TangiPlan/tasks", {userid:userid}, function(data){
			 app.taskList =new Tasks(data);
			 console.log(app.taskList);
			 that.build();
			});
		}
		else
			this.$(".message").html("שם משתמש לא נכון נסה שוב");
	},

	render: function(){
		app.taskList.fetch({success:this.build});
		this.$("svg").show();
	},

	build: function(){
		this.$(".checkList").html("");
		this.$(".login").remove();
		this.$(".message").remove();
		this.$("button").show();

		this.checked = _.chain(app.taskList
			.where({userid:app.user.get("_id"),checked:true}));

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
		setTimeout(function(){
			this.$("svg").hide();
		}, 3000);


	},



});
