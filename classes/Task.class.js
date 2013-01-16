var Task_class = new Class({

	/**
	 * Parent element of task
	 */
	element: null,

	/**
	 * ID of this task
	 */
	id: null,

	/**
	 * List of posible actions, called from request handler
	 * @type Object
	 */
	actions: null,

	/**
	 * Fields which contains this task
	 * @type Object
	 */
	fields: null,

	/**
	 * @type String
	 */
	view: null,

	/**
	 * @type String
	 */
	authenticity_token: null,

	initialize: function(element, view, authenticity_token) {

		this.element = element;

		this.view = view;

		this.authenticity_token = authenticity_token;

		this.id = this.element.id.match(/[a-z_]+(\d+)$/)[1];

		this.checkbox = $('checkbox_' + this.id);

		this.createFields();

	},

	createFields: function() {

		this.fields = {
			'status'  : new StatusField_class(this),
			'owner'   : new OwnerField_Class(this),
			'priority': new PriorityField_Class(this),
			'estimate': new EstimateField_Class(this)
		};

	},

	changeFieldValue: function(field_name, field_value) {

		if( this.fields[field_name]) {

			this.fields[field_name].changeValue(field_value);

		}

	},

	isActive: function() {

		return !!this.checkbox.checked;

	},

	getAuthenticityToken: function() {

		return this.authenticity_token;

	},

	getView: function() {

		return this.view;

	}

});