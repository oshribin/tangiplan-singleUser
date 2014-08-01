var Task = Backbone.Model.extend({

	defaults: function() {
		return {
			name: "",
			givDuration: null,
			exDuration:null,
			objectId:null,
			lastDate:null,
			checked:false,
			disable:false
		};
	},

	toggle: function() {
		this.set({checked:!this.get("checked")});
	}

});
