var ChooseTaskView_single = Backbone.View.extend({
		
	template: Handlebars.compile($("#singleTask").html()),	

	tagName:"li",

	events: {
		"click .checker" : "check",
	
	},

	check: function () {
		this.model.toggle();

	},

	initialize: function() {
		this.listenTo(this.model, "change", this.render);

	},

	render:function() {
		var html = this.template(this.model.attributes);
		this.$el.html(html);
		this.$(".checker").prop({disabled:this.model.get("disable")});
		this.$el.toggleClass("disable", this.model.get("disable"));
		return this;
	}

});	

	var MatcheObjectView_single = Backbone.View.extend({

	template: Handlebars.compile($("#matchTask").html()),

	tagName:"li",

	events:{
		"click .number" : "clickHandler",
		"click .clear" : "unsetObject"
	},

	unsetObject: function(){
		this.model.set({"objectId":null});
		console.log("jg");
	},	


	initialize: function(){
		this.listenTo(this.model, "change", this.render)
	},

	clickHandler: function(event){
		var id = $(event.currentTarget).attr("id");
		this.matchObject(id);
	},

	matchObject: function(id){
		this.model.set({"objectId":id});
	},

	render:function(){
		var html = this.template(this.model.attributes);
		this.$el.html(html);
		var curObjectId = this.model.get("objectId");
		if (curObjectId){
			var str = "Task/photos/num"+curObjectId+".ico";
			this.$(".panel-heading").append("<img class='thumb' src="+str+">");
			this.$(".panel-heading").append("<a class ='clear'>'נקה בחירה'</a>");
		}
		else{
			this.$(".thumb").remove();

		}

		return this;
	}

});	