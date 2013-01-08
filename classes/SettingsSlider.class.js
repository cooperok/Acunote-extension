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