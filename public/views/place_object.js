var placeObject_page = Backbone.View.extend({
	
	template: Handlebars.compile($("#placeObject").html()),

	events: {
		"click .homeNav" : "home",
	},

	home: function(){
		app.router.navigate("",true);
	},

	initialize: function () {
		var comTitle = Handlebars.compile($("#titleBar").html());
		var title = comTitle({title: "מיקום אובייקטים"});
		this.$el.html(title);
		this.$el.append(this.template);
	},

});