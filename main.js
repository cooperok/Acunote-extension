var SettingsSlider_class = new Class({

	'classes': {
		'hidden_settins': 'left_arrow',
		'opened_settins': 'down_arrow',
	},

	/**
	 * Element to open settings block
	 * @type Element
	 */
	toggle_btn: null,

	/**
	 * Element with arrow, just for beauty
	 * @type Element
	 */
	settings_arrow: null,

	/**
	 * Slider for settings block
	 * @type Fx.Slide
	 */
	slideFx: null,

	initialize: function() {

		this.toggle_btn = $('toggle_settings');

		this.settings_arrow = $('settings_arrow');

		this.initFx();

		this.bindEvents();

	},

	initFx: function() {

		this.slideFx = new Fx.Slide('settings', {duration: 500});

		this.slideFx.hide();

	},

	bindEvents: function() {

		this.toggle_btn.addEvent('click', function(e){

			new DOMEvent(e).stop();

			this.toggleSettings();

		}.bind(this));

	},

	toggleSettings: function(e) {

		this.slideFx.open ? this.hideSettings() : this.showSettings();

	},

	showSettings: function() {

		this.slideFx.slideIn();

		this.settings_arrow.removeClass(this.classes.hidden_settins).addClass(this.classes.opened_settins);

	},

	hideSettings: function() {

		this.slideFx.slideOut();

		this.settings_arrow.removeClass(this.classes.opened_settins).addClass(this.classes.hidden_settins);

	}

});

var Model_class = new Class({

	initialize: function() {

		this.storage = localStorage;

	},

	setValue: function(item, value) {

		this.storage.setItem(item, value);

	},

	getValue: function(value) {

		return this.storage.getItem(value);

	}

});

var Controller_class = new Class({

	model: null,

	initialize: function(model) {

		if ( model ) {

			this.model = model;

			return this;

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

var controller = new Controller_class(new Model_class());


var SettingsItem_class = new Class({

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

SettingsItem_class.implement(new Events);


/**
 * Class provides requests between extension and content scripts
 */
var ExtensionPort_class = new Class({

	current_tab: null,

	port: null,

	initialize: function() {

		chrome.tabs.getSelected(null, function(tab) {
			this.current_tab = tab;
		}.bind(this));

		chrome.extension.onConnect.addListener(function(port){
			this.port = port;
			this.port.onMessage.addListener(this.onMessage.bind(this))
		}.bind(this));

	},

	/**
	 * Handling event from content scripts
	 * @param msg
	 */
	onMessage: function(msg) {

		this.fireEvent('messageRecieved', msg);

	},

	sendRequest: function(request, callback) {

		//If content script was connected to extension we must have port and send requests through it
		if( this.port ) {

			this.port.postMessage(request);

		//If we don't have a port - sending single request to content script
		} else {

			if( this.current_tab ) {

				chrome.tabs.sendRequest(this.current_tab.id, request, callback);

			} else {

				setTimeout(function(){ this.sendRequest(request, callback)	}.bind(this), 100);

			}

		}

	}

});

ExtensionPort_class.implement(new Events);


var Settings_class = new Class({

	/**
	 * Settings items
	 * @type Object
	 */
	items: null,

	/**
	 * Block with settings
	 * @type Element
	 */
	settings: null,

	initialize: function(port) {

		this.settings = $('settings');

		this.port = port;

		this.port.sendRequest({'action': 'getValues'}, this.onResponse.bind(this));

		this._getItems();

		this.bindFillAction();

	},

	/**
	 * Event handler for response from content script
	 */
	onResponse: function(response) {

		if( typeOf(response) == 'object' ) {

			for(var item in response) {

				if( this.items[item] ) {

					this.items[item].fillValues(response[item]);

				}

			}

		}

	},

	_getItems: function() {

		this.items = {};

		this.settings.getElements('div[name=item]').each(function(item){

			var settings_item = new SettingsItem_class(item);

			this.items[ settings_item.getName() ] = settings_item;

		}.bind(this));

	},

	getItemsValues: function() {

		var items = {};

		for(var item in this.items) {

			if( !this.items[item].disabled ) {

				items[item] = this.items[item].getValue();

			}

		}

		return items;

	},

	getItem: function(name) {

		return this.items[item_name];

	},

	getItemValue: function(item_name) {

		return item_name && this.items[item_name] ? this.items[item_name].getValue() : null;

	},

	setItemValue: function(name, value) {

		if( this.items[name] ) {

			this.items[name].setValue(value);

		}

	},

	bindFillAction: function() {

		$('fill').addEvent('click', this.onFill.bind(this));

	},

	onFill: function(e) {

		new DOMEvent(e).stop();

		this.port.sendRequest({
			'action': 'fillTasks',
			'values': this.getItemsValues()
		})

	}

});

var ExtensionPort = new ExtensionPort_class();

$(window).addEvent('domready', function(){

	settings_slider = new SettingsSlider_class();

	settings = new Settings_class(ExtensionPort);

});