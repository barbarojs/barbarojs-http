'use strict';

exports.__esModule = true;

require('whatwg-fetch');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var httpProvider = function () {
	function httpProvider() {
		_classCallCheck(this, httpProvider);

		this.options = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: ''
			}
		};
	}

	httpProvider.prototype.getOptions = function getOptions() {
		return Object.assign({}, this.options);
	};

	httpProvider.prototype.setJwtToken = function setJwtToken(token) {
		this.options.headers.Authorization = 'Bearer ' + token;
	};

	httpProvider.prototype.removeJwtToken = function removeJwtToken() {
		this.options.headers.Authorization = '';
	};

	return httpProvider;
}();

exports.default = new httpProvider();
'use strict';

exports.__esModule = true;
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

	http.prototype.createParams = function createParams(URI) {
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
	};

	http.prototype.interpolate = function interpolate(data) {
		var newParts = this.interpolations.parts.slice(0);

		this.interpolations.lookup.forEach(function (position, k) {
			newParts[position] = data[k];
		});

		return newParts.join('/');
	};

	http.prototype.remap = function remap(data) {
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
	};

	http.prototype.prepare = function prepare(method, data) {
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
	};

	// return flatten payload


	http.prototype.flattenPayload = function flattenPayload(data) {
		var dataKeys = Object.keys(data);
		var newPayload = [];

		dataKeys.forEach(function (key) {
			newPayload.push(key + '=' + encodeURIComponent(data[key]));
		});

		return newPayload.join('&');
	};

	// turn JS objects into base64 strings


	http.prototype.serialiseData = function serialiseData(data) {
		var newData = {};
		var dataKeys = Object.keys(data);

		dataKeys.forEach(function (key) {
			var val = data[key];
			newData[key] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? btoa(JSON.stringify(val)) : val;
		});

		return newData;
	};

	http.prototype.get = function get(data) {
		var _prepare = this.prepare(VERBS.GET, data),
		    URI = _prepare.URI,
		    options = _prepare.options;

		return fetch(URI, options).then(function (res) {
			return res;
		});
	};

	http.prototype.post = function post(data) {
		var _prepare2 = this.prepare(VERBS.POST, data),
		    URI = _prepare2.URI,
		    options = _prepare2.options;

		return fetch(URI, options).then(function (res) {
			return res;
		});
	};

	return http;
}();

exports.default = http;
'use strict';

exports.__esModule = true;
exports.httpProvider = exports.http = undefined;

var _http2 = require('./http');

var _http3 = _interopRequireDefault(_http2);

var _httpProvider2 = require('./http-provider');

var _httpProvider3 = _interopRequireDefault(_httpProvider2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.http = _http3.default;
exports.httpProvider = _httpProvider3.default;
