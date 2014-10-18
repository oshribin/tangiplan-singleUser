var placeObject_page = Backbone.View.extend({
	
	template: Handlebars.compile($("#placeObject").html()),

	initialize: function () {
		var comTitle = Handlebars.compile($("#titleBar").html());
		var title = comTitle({title: "מיקום אובייקטים"});
		this.$el.html(title);
		this.$el.append(this.template);
		
		setTimeout(function(){router.navigate("", true)}, 10000);
	},

});