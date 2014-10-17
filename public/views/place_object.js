var placeObject_page = Backbone.View.extend({
	
	template: Handlebars.compile($("#placeObject").html()),

	initialize: function () {
		var comTitle = Handlebars.compile($("#titleBar").html());
		var title = comTitle({title: "מיקום אובייקטים"});


		this.$el.html(title);
		this.$el.append(this.template);

		taskList.fetch({success:this.render});
	},

	render: function(){
		var checked = app.user.checked();
		_.chain(checked).sortBy(function(task){return task.get("objectId")})
						.each(function(task){
						this.$(".placeList").append("<li>" + task.get("name") + task.get("objectId") + "</li>");
		});
	}
});