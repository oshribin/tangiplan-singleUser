var CheckList_page = Backbone.View.extend({
	template: Handlebars.compile($("#checkList").html()),

	events:{
		"click .render" : "render"
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
			.where({userid:this.model.get("_id"),checked:true}))	;


		var _iterator = function(task){
			return Date.parse(task.get("lastDate"))
		};

		var sortChecked = _.chain(this.checked).sortBy(_iterator);

		sortChecked.each(function(task){
			var oneView = new checkTask({model:task});
			this.$(".checkList").append(oneView.render().el);
			
			var _predicate = function(otherTask){
				otp = Date.parse(otherTask.get("lastDate"));
				tp = Date.parse(task.get("lastDate"));
				otx = otherTask.get("exDuration");
				tx = task.get("exDuration"); 	
				return ((otp > tp) && (otx != null) && (tx != null));
			};

			var next = sortChecked.find(_predicate);
			var next = next._wrapped;

			if(next){
				otp = Date.parse(next.get("lastDate"));
				tp = Date.parse(task.get("lastDate"));
				var freeTime = app.user.parseVal(otp - tp - app.user.parsMill(task.get("exDuration")));
				task.save({"freeTime":freeTime});
				this.$(".checkList").append("<li class='row'><span class='label label-default col-xs-12'>זמן בין המשימות - "+ freeTime + "</spanv></li>");
			}

		});
	},


});