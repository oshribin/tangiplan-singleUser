var SignIn_page = Backbone.View.extend({
	
	template: Handlebars.compile($("#signIn").html()),

	events:{
		"click .connect": "connect",
	},

	connect: function () {
		var name = this.$(".username").val();
		console.log(name);
		var user = userList.findWhere({name:name});

		if(user){
			app.user = user;
			this.next();
		}
		else
			this.$(".message").html("שם משתמש לא נכון נסה שוב");
	},

	next: function(){
		router.navigate("wake_up", true);
	},

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"כניסה"});
		this.$el.html(title);
		this.$el.append(this.template);
		userList.fetch();
	},
});