'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('whatwg-fetch');

var _httpProvider = require('./http-provider');

var _httpProvider2 = _interopRequireDefault(_httpProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VERBS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
};

var http = function () {
	function http(apiURI) {
		_classCallCheck(this, http);

		this.interpolationRegExp = /(\:[a-z])/i;
		this.provider = _httpProvider2.default;
		this.apiURI = apiURI;
		this.interpolations = {};

		this.createParams(apiURI);
	}

	/**
  * Build params struct
  */


	_createClass(http, [{
		key: 'createParams',
		value: function createParams(URI) {
			var _this = this;

			var lookup = new Map();

			// split querystring from body
			var parts = URI.split('/');
			var keys = [];
			parts.forEach(function (x, i) {
				if (_this.interpolationRegExp.test(x)) {
					var k = x.substr(1);
					lookup.set(k, i);
					keys.push(k);
				}
			});

			this.interpolations = {
				keys: keys,
				parts: parts,
				lookup: lookup
			};
		}

		/**
   * Interpolate params
   */

	}, {
		key: 'interpolate',
		value: function interpolate(data) {
			var newParts = this.interpolations.parts.slice(0);

			this.interpolations.lookup.forEach(function (position, k) {
				newParts[position] = data[k];
			});

			return newParts.join('/');
		}

		/**
   * Remap data
   */

	}, {
		key: 'remap',
		value: function remap(data) {
			var _this2 = this;

			var dataKeys = Object.keys(data);
			var params = {};
			var payload = {};

			dataKeys.filter(function (x) {
				return _this2.interpolations.keys.includes(x);
			}).forEach(function (x) {
				return params[x] = data[x];
			});
			dataKeys.filter(function (x) {
				return !_this2.interpolations.keys.includes(x);
			}).forEach(function (x) {
				return payload[x] = data[x];
			});

			return { params: params, payload: payload };
		}

		/**
   * Call this only in test
   */

	}, {
		key: 'prepare',
		value: function prepare(method, data) {
			// get params for interpolation and payload
			var _remap = this.remap(data),
			    params = _remap.params,
			    payload = _remap.payload;

			// replace parts in the template


			var URI = this.interpolate(params);

			// get default fetch options form provider
			var options = Object.assign(this.provider.getOptions(), { method: method });

			// check if payload is not empty
			if (Object.keys(payload).length) {
				if (method === VERBS.GET) {
					// encode string here
					URI = URI + '?' + this.flattenPayload(payload);
				} else {
					options.body = JSON.stringify(payload);
				}
			}

			return { URI: URI, options: options };
		}

		/**
   * Main method
   */

	}, {
		key: 'request',
		value: function request(method, data) {
			// prepare request
			var _prepare = this.prepare(method, data),
			    URI = _prepare.URI,
			    options = _prepare.options;

			// use fetch lib to perform request


			return fetch(URI, options).then(function (req) {
				// status is an error
				if (req.status >= 400) {
					return Promise.reject(req);
				}

				return req;
			});
		}

		// return flatten payload

	}, {
		key: 'flattenPayload',
		value: function flattenPayload(data) {
			var dataKeys = Object.keys(data);
			var newPayload = [];

			dataKeys.forEach(function (key) {
				newPayload.push(key + '=' + encodeURIComponent(data[key]));
			});

			return newPayload.join('&');
		}

		/**
   * turn JS objects into base64 strings
   */

	}, {
		key: 'serialiseData',
		value: function serialiseData(data) {
			var newData = {};
			var dataKeys = Object.keys(data);

			dataKeys.forEach(function (key) {
				var val = data[key];
				newData[key] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? btoa(JSON.stringify(val)) : val;
			});

			return newData;
		}

		/**
   * Aliases of request
   */

	}, {
		key: 'get',
		value: function get(data) {
			return this.request(VERBS.GET, data);
		}
	}, {
		key: 'post',
		value: function post(data) {
			return this.request(VERBS.POST, data);
		}
	}, {
		key: 'patch',
		value: function patch(data) {
			return this.request(VERBS.PATCH, data);
		}
	}, {
		key: 'put',
		value: function put(data) {
			return this.request(VERBS.PUT, data);
		}
	}, {
		key: 'delete',
		value: function _delete(data) {
			return this.request(VERBS.DELETE, data);
		}
	}]);

	return http;
}();

exports.default = http;