var WakeUp_page = Backbone.View.extend({
	template: Handlebars.compile($("#wakeUp").html()),


	events:{
		"click .next":"next",
		"click .back":"back",
	},

	back: function(){
		router.navigate("",true);
	},

	next: function(){
		var current = this.$("input").val();
		console.log(current);
		var _rout = function(){router.navigate("go_out", true)};
		
		this.model.save({wakeUp:current},{success:_rout});

		
	},

	render: function(){
		var comTitle = Handlebars.compile($("#titleBar").html());
		var title = comTitle({title:"מתי אתה מתעורר ?"});
		var comNav = Handlebars.compile($("#bottom-nav").html());
		var nav = comNav();

		this.$el.html(title);
		this.$el.append(nav);
		this.$el.append(this.template);

		this.set_clock();



	},

	set_clock:function(){
	    this.$('input').mobiscroll().time({
	      display : "inline",
	      hourText : "שעות",
	      minuteText: "דקות",
	      theme:"ios",
	      height:"100",
	      timeWheels:"HHii",
	      timeFormat: "HH:ii",
	      stepMinute:5,
	    });  
	},

	initialize: function(){
		this.render();
	}

});



