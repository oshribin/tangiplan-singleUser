var SignIn_page = Backbone.View.extend({
	
	template: Handlebars.compile($("#signIn").html()),

	events:{
		"click .connect": "connect",
		"click .arange" : "arangeNav",
		"click .checkList" : "checkListNav"
	},

	connect: function () {
		var name = this.$(".username").val();
		var user = userList.findWhere({name:name});

		if(user){
			app.user = user;
			app.user.setTaskList();
			this.$(".btn").show();
		}
		else
			this.$(".message").html("שם משתמש לא נכון נסה שוב");
	},

	arangeNav: function(){
		router.navigate("wake_up", true);
	},

	checkListNav: function(){
		router.navigate("checkList", true);
	},

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"כניסה"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.$(".btn").hide();

		userList.fetch();
	},
});