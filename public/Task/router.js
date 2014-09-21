var Router = Backbone.Router.extend({
	routes: {
		"":"signIn",
		"Debug":"Debug",
		"checkList":"checkList",
		"wake_up":"wakeUp",
		"go_out":"goOut",
		"choose_tasks":"chooseTask",
		"match_objects":"matchObjects",
		"set_durations":"setDurations",
		},

		checkList:function(){
			if(app.user){
				var view = new CheckList_page({model:app.user});
				app.render(view);
			} 
			else
				this.navigate("",true);
			
		},

		signIn: function(){
			var view = new SignIn_page();
			app.render(view);
		},

		Debug: function(){
			if(app.user){
				var view = new Debug();
				app.render(view);
			}
			else
				this.navigate("", true);

		},

		wakeUp: function () {
			if(app.user){
				var view = new WakeUp_page({model:app.user});
				console.log(view);
				app.render(view);
			}
			else
				this.navigate("", true);
			
		},

		goOut: function(){
			if(app.user){
				var view = new GoOut_page({model:app.user});
				app.render(view);
			}
			else
				this.navigate("", true);

		},

		chooseTask: function(){
			if(app.user){
				var view = new ChooseTaskView_page();
				app.render(view);
			}
			else
				this.navigate("", true);
		},

		matchObjects: function(){
		if(app.user){
			var view = new MatchObjectView_page();
			app.render(view);
			}
		else
			this.navigate("", true);	
				
			
		},

		setDurations:function(){
			if(app.user){
				var view = new SetDuration_page({model:app.user});
				app.render(view);
			}
			else
				this.navigate("", true);
			
		}
});

var App = Backbone.View.extend({

	user: null,

	render: function(view){
		var prev = this.curView || null;

		if(prev){
			prev.remove();
		}
		this.$el.append(view.el);
		this.curView = view;
	},
});
	var userList = new Users;
	var taskList = new Tasks;
	var app = new App({el:(".container")});
	var router = new Router();
	Backbone.history.start();



