var SettingsItem_class = new Class({

	Implements: [Events],

	/**
	 * Main element with all fields
	 * @type Element
	 */
	element: null,

	/**
	 * Name of setting
	 * @type String
	 */
	name: null,

	/**
	 * Element with setting name
	 */
	name_field: null,

	/**
	 * Checkbox to disabling setting
	 * @type Element
	 */
	checkbox: null,

	/**
	 * Element with value of setting
	 */
	value_field: null,

	initialize: function(element) {

		this.element = element;

		this.name = this.element.getProperty('_setting_name');

		if( !this.name ) return null;

		this.name_field = this.element.getElement('[name=name]');

		this.checkbox = this.element.getElement('[name=checkbox]');

		this.value_field = this.element.getElement('[name=value]');

		this.init();

		this.bindEventsListeners();

	},

	bindEventsListeners: function() {

		this.name_field.addEvent('click', function(e){

			new DOMEvent(e).stop();

			this.disabled ? this.enable() : this.disable();

		}.bind(this));

		this.checkbox.addEvent('change', function(e){

			new DOMEvent(e).target.checked ? this.enable() : this.disable();

		}.bind(this));

		this.value_field.addEvent('change', function(e){

			this.setValue(new DOMEvent(e).target.value);

			this.fireEvent('valueChanged');

		}.bind(this));

		this.addEvent('statusChanged', this.onChangeStatus.bind(this));

		this.addEvent('valueChanged', this.onChangeValue.bind(this));

	},

	init: function() {

		this.setDefaultValues();

		controller.getValue(this.name + '_disabled') == 'true' ? this.disable() : this.enable();

	},

	setDefaultValues: function() {

		var value = controller.getValue(this.name);

		if(value) this.setValue(value);

	},

	/**
	 * Fill all posible values of setting
	 * @param values - object, key = setting title, value = setting value
	 */
	fillValues: function(values) {

		var options = [];

		for(var value in values) {

			var option = new Element('option', {value: values[value], html: value});

			options.push(option);

		}

		this.value_field.adopt(options);

		this.setDefaultValues();

	},

	disable: function() {

		this.disabled = true;

		this.checkbox.checked = false;

		this.element.addClass('disabled');

		this.fireEvent('statusChanged');

	},

	enable: function() {

		this.disabled = false;

		this.checkbox.checked = true;

		this.element.removeClass('disabled');

		this.fireEvent('statusChanged');

	},

	getName: function() {

		return this.name;

	},

	setValue: function(value) {

		this.value = value;

		this.value_field.value = value;

	},

	getValue: function() {

		return this.value;

	},

	/**
	 * Event handling on disabling or enabling setting
	 */
	onChangeStatus: function() {

		controller.setValue(this.name + '_disabled', this.disabled);

	},

	/**
	 * Event handling on change value of setting
	 */
	onChangeValue: function() {

		this.enable();

		controller.setValue(this.name, this.value);

	}

});