var Controller_class = new Class({

	model: null,

	initialize: function(model) {

		if ( model ) {

			this.model = model;

		} else {

			return null;

		}

	},

	getValue: function(value) {

		return this.model.getValue(value);

	},

	setValue: function(item, value) {

		this.model.setValue(item, value);

	}

});