'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpProvider = exports.http = undefined;

var _http2 = require('./http');

var _http3 = _interopRequireDefault(_http2);

var _httpProvider2 = require('./http-provider');

var _httpProvider3 = _interopRequireDefault(_httpProvider2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.http = _http3.default;
exports.httpProvider = _httpProvider3.default;