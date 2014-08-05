
var ChooseTaskView_page = Backbone.View.extend({


	template: Handlebars.compile($("#chooseTasks").html()),

	events:{
		"click .btn":"create_new_task"
	},

	create_new_task: function(){
		var name = this.$(".newTask").val();
		if(this.checked.length == 6){
			task = taskList.create({"name":name, "disable":true});
		}
		else
			task = taskList.create({"name":name});
		
		

	},


	add_one: function(task){
		var oneView = new ChooseTaskView_single({model:task});
		this.$(".simpleList").append(oneView.render().el);

	},

	add_all: function(){
		taskList.each(this.add_one);
	},

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"בחר משימות"});
		this.$el.html(title);
		this.input = this.$(".newTask");
		this.$el.append(this.template);
		taskList.fetch();
		this.add_all();
		this.listenTo(taskList, "add", this.add_one);
		this.listenTo(taskList, "reset", this.add_all);
		this.listenTo(taskList, "change", this.render);
		this.render();

	},

	disable_unchecked: function(){
		_.chain(this.unchecked).each(function(model){
			model.save({"disable":true});
		});
	},

	realese: function(){
		taskList.each(function(model){
			model.save({"disable":false});
		});
	},


	render: function(){
		this.checked = taskList.where({checked:true});
		this.unchecked = taskList.where({checked:false});
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


