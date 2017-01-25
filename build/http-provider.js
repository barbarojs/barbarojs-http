'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('whatwg-fetch');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var httpProvider = function () {
	function httpProvider() {
		_classCallCheck(this, httpProvider);

		this.middlewares = [];

		this.options = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: null
			}
		};
	}

	/**
  * Fetch options
  */


	_createClass(httpProvider, [{
		key: 'getOptions',
		value: function getOptions() {
			return Object.assign({}, this.options);
		}
	}, {
		key: 'setOptions',
		value: function setOptions(options) {
			Object.assign(this.options, options);
		}

		/**
   * Add new middleware
   */

	}, {
		key: 'use',
		value: function use(middleware) {
			this.middlewares.push(middleware);
		}

		/**
   * Concat middlewares to the main promise
   */

	}, {
		key: 'concatMiddlewares',
		value: function concatMiddlewares(fetchPromise) {
			var promise = fetchPromise;

			this.middlewares.forEach(function (middleware) {
				promise = promise.then(function (req) {
					return middleware(req);
				} // return Promise.resolve/reject
				);
			});

			return promise;
		}

		/**
   * JWT utils
   */

	}, {
		key: 'setJwtToken',
		value: function setJwtToken(token) {
			this.options.headers.Authorization = 'Bearer ' + token;
		}
	}, {
		key: 'removeJwtToken',
		value: function removeJwtToken() {
			this.options.headers.Authorization = null;
		}
	}]);

	return httpProvider;
}();

exports.default = new httpProvider();