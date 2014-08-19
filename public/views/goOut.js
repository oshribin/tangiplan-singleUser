var GoOut_page = Backbone.View.extend({
	template: Handlebars.compile($("#wakeUp").html()),

  events:{
    "click .next":"next",
  },

  next: function(){
    
    var curgoOut = this.$(".input").val();
    this.model.set({goOut:curgoOut});
    router.navigate("choose_tasks", true);


  },

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"מתי אתה יוצא ?"});
		this.$el.append(title);
		this.$el.append(this.template);
		this.set_clock();

	},

	set_clock:function(){
		$.widget( "ui.timespinner", $.ui.spinner, {
    		options: {
      		// seconds
     		step: 60 * 1000,
    	    // minuits
      		page: 60
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

	},

});