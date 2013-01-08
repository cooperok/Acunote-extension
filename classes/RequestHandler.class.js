var RequestHandler_class = new Class({

	handler_actions: null,

	initialize: function() {

		this.handler = new Acunote_class();

		this.handler_actions = this.handler.getActions();

	},

	/**
	 * Handling extensions requests
	 * @param msg Object
	 */
	handle: function(msg) {

		if(typeOf(msg) == 'object') {

			if(msg['action']) {

				if(this.handler_actions.indexOf(msg['action']) != -1) {

					var return_value = this.handler[ msg['action'] ](msg);

				} else {

					var return_value = {'error': 'Action "' + msg['action'] + '" don\'t exists'};

				}

			} else {

				var return_value = {'error': 'Send action name as \'action\' value'};

			}

		} else {

			var return_value = {'error': 'Request value must be object, ' + typeOf(msg) + ' given'};

		}

		return return_value;

	}

});