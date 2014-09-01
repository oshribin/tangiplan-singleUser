var WakeUp_page = Backbone.View.extend({
	template: Handlebars.compile($("#wakeUp").html()),


	events:{
		"click .next":"next",
	},

	next: function(){
		var curwakeUp = this.$("input").val();
		this.model.save({wakeUp:curwakeUp});
		router.navigate("go_out", true);
	},

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"מתי אתה מתעורר ?"});
		this.$el.html(title);
		this.$el.append(this.template);
		this.set_clock();
	},

	set_clock:function(){
		this.$('input').mobiscroll().time({
			display : "inline",
            hourText : "שעות",
            minuteText: "דקות",
            theme: "ios",
        	height:"100",
        	timeWheels:"HHii",
        	timeFormat: "HH:ii"});

		this.$('input').val("02:00");	

	},

});