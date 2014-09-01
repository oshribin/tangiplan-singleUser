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

var SetDuration_single = Backbone.View.extend({
	template: Handlebars.compile($("#setDuration").html()),

	tagName:"li",

	events:{
		"click .dwb-s" : "set",
	},

	set_clock: function(){
		var _func = function(valueText, btn, inst){
			if (btn == "set"){
				this.model.set({givDuration:valueText});
				app.user.updateLeft();
        	}
		};
		_func = _.bind(_func, this);

		this.$('input').mobiscroll().time({
			display : "modal",
            hourText : "שעות",
            minuteText : "דקות",
        	theme : "ios",
        	onClose: _func,
        });   

		var cur = this.model.get("givDuration");
		var cur = cur != null ? cur : "00:00"
		this.$('input').val(cur);
	
		
		

	},

	set: function(){
		console.log(this.$('input').val());
		this.model.set({givDuration:this.$('input').val()});
		app.user.updateLeft();
	},


	save: function(){
		var curDuration = this.$("input").val();
		this.model.save({givDuration:curDuration});
	},

	render:function(){
		var html = this.template(this.model.attributes);
		this.$el.html(html);
		this.$(".exDuration").toggleClass("warning", this.model.get("overexcep")==true);
				this.$(".exDuration").toggleClass("success", this.model.get("overexcep")==false);

		this.set_clock();
		return this;
	}

});

	var checkDuration = Backbone.View.extend({
		template: Handlebars.compile($("#checkDuration").html()),

		tagName: "li",

		set_clock:function(){
			$.widget( "ui.timespinner", $.ui.spinner, {
	    		options: {
	      		// seconds
	     		step: 600 * 1000,
	    	    // minuits
	      		page: 60,

	      		disabled: true,

	      		
	    		},

	            _parse: function( value ) {  
	     	   		if ( typeof value === "string" ) {
	        			// already a timestamp
	      		  		if ( Number( value ) == value ) {
	        		    	return Number( value );
	       				}
	        			return +Globalize.parseDate( value );
	     			}	
	     			return value;
	   			},
	 
	    		_format: function( value ) {
	      
	     			return Globalize.format( new Date(value), "t" );
	   			}
 		});

		var x=this.$('input').timespinner();
		Globalize.culture('de-DE');
		this.$('input').timespinner('option','value', '02:00');
			this.$('input').val(this.model.get("exDuration"));
		
		

		
		

	},

		render:function(){

		var html = this.template(this.model.attributes);
		this.$el.html(html);
		this.set_clock();
		return this;
	}


		
});