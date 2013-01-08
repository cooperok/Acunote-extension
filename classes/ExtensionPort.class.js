/**
 * Class provides requests between extension and content scripts
 */
var ExtensionPort_class = new Class({

	Implements: [Events],

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