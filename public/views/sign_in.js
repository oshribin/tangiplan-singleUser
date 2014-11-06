var SignIn_page = Backbone.View.extend({
	
	template: Handlebars.compile($("#signIn").html()),

	events:{
		"click .connect": "connect",
		"click .arange" : "arangeNav",
		"click .checkList" : "checkListNav",
		"click .setDuration" : "setDurationNav"
	},

	connect: function () {
		var name = this.$(".username").val();
		var password = this.$(".password").val();
		var user = userList.findWhere({name:name});
		$.post("/login",{name:name,password:password});

		if(user){
			app.user = user;
			app.user.setTaskList();
			taskList.fetch({success:this.btncntrl});
		}
		else
			this.$(".message").html("שם משתמש לא נכון נסה שוב");
	},
	setDurationNav: function(){
		app.last = "signIn";
		router.navigate("set_durations", true);
	},

	arangeNav: function(){
		router.navigate("wake_up", true);
	},

	checkListNav: function(){
		router.navigate("checkList", true);
	},

	btncntrl: function(){
		this.$(".login").remove();
		this.$("h1").show();
		this.$(".message").remove();
		if(app.user.checked().length == 0)
			this.$(".setDuration").prop("disabled",true);
		if(_.chain(app.user.checked()).length == 0)
			this.$(".checkList").prop("disabled",true);
			
		this.$(".btn").show();
		},

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"TangiPlan"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.$(".btn").hide();
		this.$("h1").hide();
		userList.fetch();
		if(app.user){
			this.btncntrl();
		}
	
	},
});