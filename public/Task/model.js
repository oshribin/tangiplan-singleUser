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
			exception:null
			
		};	
	},

	idAttribute:"_id",	

	toggle: function() {
		this.save({checked:!this.get("checked")});
	}

});
