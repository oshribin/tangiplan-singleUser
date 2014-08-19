var Task = Backbone.Model.extend({

	urlRoot:"/TangiPlan/tasks",

	defaults: function() {
		return {
			name: "",
			givDuration: null,
			exDuration:null,
			objectId:null,
			lastDate:null,
			checked:false,
			disable:false,
			exception:null,
			endedByUser:null,
			overexcep:null,
			
		};	
	},

	idAttribute:"_id",	

	toggle: function() {
		this.save({checked:!this.get("checked")});
	}

});

var User = Backbone.Model.extend({

	urlRoot: "/TangiPlan/users",

	defaults: function(){
		return{
			name:"",
			pass:"",
			wakeUp:null,
			goOut:null,
		};
	},
});

