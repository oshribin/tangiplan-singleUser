var ChooseTaskView_single = Backbone.View.extend({
		
	template: Handlebars.compile($("#singleTask").html()),	

	tagName:"li",

	events: {
		"click .checker" : "check"
	
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
		var curObjectId = this.model.get("objectId");
		this.$(".thumb").remove();
		this.$(".clear").remove();
		$("[id ="+curObjectId+"]").removeClass("disabled");
		this.model.save({"objectId":null});
	},	


	initialize: function(){

	},

	clickHandler: function(event){
		var curObjectId = this.model.get("objectId");
		if(curObjectId){
			this.unsetObject();
		}
		var id = $(event.currentTarget).attr("id");
		this.model.save({"objectId":id});
		this.updateView(id);
	},


	updateView: function(curObjectId){
		var str = "public/photos/num"+curObjectId+".ico";
		this.$(".panel-heading").append("<img class='thumb' src="+str+">");
		this.$(".panel-heading").append("<a class ='clear'>'נקה בחירה'</a>");
		$("[id ="+curObjectId+"]").addClass("disabled");

	},



	render:function(){
		this.model.save({"objectId":null});
		var html = this.template(this.model.attributes);
		this.$el.html(html);
		return this;
	
	}
});	
