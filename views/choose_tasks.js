
var ChooseTaskView_page = Backbone.View.extend({


	template: Handlebars.compile($("#chooseTasks").html()),

	events:{
		"click .btn":"create_new_task"
	},

	create_new_task: function(){
		var name = this.$(".newTask").val();
		if(this.checked.length == 6){
			var new_model = new Task({"name":name, "disable":true});
			console.log("fi");
		}
		else{
			var new_model = new Task({"name":name});
		}
		taskList.add(new_model);

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
		this.add_all();
		this.listenTo(taskList, "add", this.add_one);
		this.listenTo(taskList, "reset", this.add_all);
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



//debugging
var model0 = new Task({name:"לצחצח שיניים"}); 
var model1 = new Task({name:"להכין תיק"}); 
var model2 = new Task({name:"לאכול ארוחת בוקר"}); 
var model3 = new Task({name:"להוציא את הכלב לטיול"}); 
var model4 = new Task({name:"להחליף בגדים"}); 
var model5 = new Task({name:"לזרוק את הזבל"}); 
var model6 = new Task({name:"להתקלח"}); 
var model7 = new Task({name:"להכין סנדוויץ"});
taskList.add(model0);
taskList.add(model1);
taskList.add(model2);
taskList.add(model3);
taskList.add(model4);
taskList.add(model5);
taskList.add(model6);
taskList.add(model7);
//var view = new ChooseTaskView_page({el:$("body")});
