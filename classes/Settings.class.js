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

		this._getItems();

		this.port = port;

		this.port.sendRequest({'action': 'getValues'}, this.onResponse.bind(this));

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