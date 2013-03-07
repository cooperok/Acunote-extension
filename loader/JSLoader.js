/**
 * JSLoader provides loading of scripts in clear sequence
 * the list of scripts places in json file.
 * It is usefull to load many classes in single files
 */
(function(window, doc) {

	var head = doc.head;

	//Constructor
	var JSLoader = function(options) {

		this.options = {
			class_suffix  : '_class',           //suffix of variable of class
			file_extension: '.class.js',        //extension of file with script of class
			json_url      : 'json/classes.json',//path to json file with list of required files
			match_order   : true                //load js files in the same order as in json file,
												//if false - loading order = libs, classes, scripts
		};

		/**
		 * List of all script from json file
		 */
		this.scripts_list = {};

		/**
		 * Array with pathes to js files
		 */
		this.scripts = [];

		this.events = {};

		//User defined options
		for (var i in options) this.options[i] = options[i];

		this.loadJSON();

	};

	JSLoader.prototype = {

		/**
		 * Loading json file with all required scripts filenames
		 */
		loadJSON: function() {

			var script = doc.createElement('script');

			var xhr = new XMLHttpRequest();

			xhr.open('GET', chrome.extension.getURL(this.options.json_url), true);

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					this.onLoadJSON(xhr.responseText);
				}
			}.bind(this);

			xhr.send(null);

		},

		onLoadJSON: function(response) {

			this.scripts_list = JSON.parse(response);

			if (this.options.match_order) {

				this.collectAllScripts();

			} else {

				//First collecting libraries
				this.collectScriptsByType('libs');

				//Then all classes
				this.collectClasses();

				//Then collecting other scripts
				this.collectScriptsByType('scripts');

			}

			this.load();

		},

		/**
		 * Collects pathes of all required js scripts
		 */
		collectAllScripts: function() {

			for(var type in this.scripts_list) {

				this.collectScriptsByType(type);

			}

		},

		/**
		 * Collects pathes of required js scripts except classes
		 */
		collectScriptsByType: function(type) {

			if (this.scripts_list[type]) {

				for(var i = 0; i < this.scripts_list[type].length; i++) {

					//key of script_list object matches the directory name
					var path = type + '/' + this.scripts_list[type][i];

					this.scripts.push(chrome.extension.getURL(path));

				}

				delete this.scripts_list[type];

			}

		},

		/**
		 * Collects pathes of all required js classes
		 */
		collectClasses: function() {

			if (this.scripts_list.classes) {

				for(var i = 0; i < this.scripts_list.classes.length; i++) {

					var path = 'classes/'
						+ this.scripts_list.classes[i].replace(this.options.class_suffix, '')
						+ this.options.file_extension;

					this.scripts.push(chrome.extension.getURL(path));

				}

			}

		},

		/**
		 * Load all required scripts in clear sequence
		 */
		load: function() {

			this.loadScript(this.scripts.shift());

		},

		/**
		 * Puts script tag into html to load script
		 * @param src String
		 */
		loadScript: function(src) {

			var script = doc.createElement('script');

			script.src = src;

			script.onload = this.onLoadScript.bind(this, script);

			head.appendChild(script);

		},

		onLoadScript: function(script) {

			if (this.scripts.length) {

				this.load();

			} else {

				//If all scripts load dispatching event
				this.dispatchEvent('load');

			}

		},

		addEventListener: function(event, callback){

			this.events[event] = this.events[event] || [];

			if (this.events[event]) {

				this.events[event].push(callback);

			}

		},

		removeEventListener: function(event, callback){

			var result = false;

			if (this.events[event]) {

				var listeners = this.events[event];

				for (var i = listeners.length-1; i >= 0; --i){

					if (listeners[i] === callback) {

						listeners.splice(i, 1);

						result = true;

					}

				}

			}

			return result;

		},

		dispatchEvent: function(event){

			if (this.events[event]) {

				var listeners = this.events[event], len = listeners.length;

				while (len--) {

					listeners[len](this);	//callback with self

				}

			}

		}

	};

	window.JSLoader = JSLoader;

})(window, document);