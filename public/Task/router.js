var Router = Backbone.Router.extend({
	routes: {
		"":"wakeUp",
		"wake_up":"wakeUp",
		"go_out":"goOut",
		"choose_tasks":"chooseTask",
		"match_objects":"matchObjects",
		"set_durations":"setDurations",	},

		wakeUp: function () {
			var view = new WakeUp_page({model:user});
			app.render(view);
			
		},

		goOut: function(){
			var view = new GoOut_page({model:user});
				app.render(view);
		},

		chooseTask: function(){
			var view = new ChooseTaskView_page();
				app.render(view);
		},

		matchObjects: function(){
			var view = new MatchObjectView_page();
			app.render(view);	
				
			
		},

		setDurations:function(){
			var view = new SetDuration_page();
			app.render(view);
			
		}
});

var App = Backbone.View.extend({

	render: function(view){
		var prev = this.curView || null;

		if(prev){
			prev.remove();
			console.log("removed");
		}
		this.$el.append(view.el);
		this.curView = view;
	},
});

var app = new App({el:(".container")});

var router = new Router();
Backbone.history.start();

