ContentPort_class = new Class({

	port: null,

	requestHandler: null,

	extension_name: 'Acunote helper',

	initialize: function() {

		this.requestHandler = new RequestHandler_class();

		this.port = chrome.extension.connect({name: this.extension_name});

		//Adding event listener for extensions requests
		this.port.onMessage.addListener(this.onMessage.bind(this));

		//Adding event listener for single extension request
		chrome.extension.onRequest.addListener(this.onSingleRequest.bind(this));

	},

	/**
	 * Extension requests handler
	 * @param msg - mixed values
	 */
	onMessage: function(msg) {

		var response = this.requestHandler.handle(msg);

		this.sendRequest(response);

	},

	/**
	 * Handler of single request from extension
	 * @param request - mixed values sended by the extension
	 * @param sender - tab which had sent a request
	 * @param sendResponse - callback function
	 */
	onSingleRequest: function(request, sender, sendResponse){

		var response = this.requestHandler.handle(request);

		sendResponse(response);

	},

	/**
	 * Sending request to extension
	 * @param request - mixed values
	 */
	sendRequest: function(request) {

		this.port.postMessage(request);

	}

});