
var ChooseTaskView_page = Backbone.View.extend({


	template: Handlebars.compile($("#chooseTasks").html()),

	events:{
		"click .next":"next",
		"click .add":"create_new_task"
	},

	next: function(){

		var flag = this.validate();
		if(flag){
			var nav = _.after(taskList.length, function(){
				router.navigate("match_objects", true);
			});
			taskList.each(function(task){
				task.save(task.attributes, {success:nav});	
			});
		}

		else
			alert("אתה חייב לבחור לפחות משימה אחת");

	},

	validate: function(){
		var flag = false;
		taskList.each(function(task){
			if(task.get("checked")){
				flag = true;
			}
		});
		return flag;
	},


	create_new_task: function(){
		var name = this.$(".newTask").val();
		var userid = app.user.get("_id");
		if(this.checked.length == 6){
			task = taskList.create({"name":name, "disable":true, "userid":userid});
		}
		else
			task = 	taskList.create({"name":name, "userid":userid});
		this.$(".newTask").val("");

			
	},

	add_one: function(task){
		console.log(task);
		var oneView = new ChooseTaskView_single({model:task});
		this.$(".simpleList").append(oneView.render().el);

	},
	
	add_all: function(){
		_.chain(taskList.where({userid:app.user.get("_id")})).each(function(task){
			var oneView = new ChooseTaskView_single({model:task});
			this.$(".simpleList").append(oneView.render().el);
		});
	},

	initialize: function(){
		var comTitle = Handlebars.compile($("#titleBar").html());
		var title = comTitle({title:"בחר משימות"});
		var comNav = Handlebars.compile($("#bottom-nav").html());
		var nav = comNav();

		this.$el.html(title);
		this.$el.append(nav);
		this.$el.append(this.template);
		taskList.fetch({success:this.add_all, silent:true});
		
		this.listenTo(taskList, "add", this.add_one);
		this.listenTo(taskList, "change", this.render);
		this.render();


	},

	disable_unchecked: function(){
		_.chain(this.unchecked).each(function(model){
			model.set({"disable":true});
		});
	},

	realese: function(){
		taskList.each(function(model){
			model.set({"disable":false});
		});
	},


	render: function(){
		this.checked = taskList.where({userid:app.user.get("_id"),checked:true});
		this.unchecked = taskList.where({userid:app.user.get("_id"),checked:false});
		if (this.checked.length == 6){
			this.disable_unchecked();
			this.$(".message").html("הגעת למקסימום משימו אפשריות")
		}
		else{
			this.realese();
			this.$(".message").html("")
		}
	},
});



