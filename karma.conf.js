require('babel-register');
var path = require('path');

module.exports = function (config) {
	config.set({
		basePath: './',
		frameworks: ['mocha', 'chai-sinon'],
		reporters: ['mocha', 'coverage'],
		coverageReporter: {
			reporters: [{
					type: 'text-summary'
				},
				{
					type: 'html',
					dir: 'coverage',
					subdir: '.'
				}
			]
		},
		browsers: ['PhantomJS'],
		files: [
			'node_modules/babel-polyfill/dist/polyfill.js',
			'test/*.js'
		],
		preprocessors: {
			'test/**/*.js': ['webpack'],
			'src/**/*.js': ['webpack'],
			// '**/*.js': ['sourcemap']
		},
		babelPreprocessor: {
			options: {
				presets: ['es2015']
			}
		},
		webpack: {
			module: {
				loaders: [{
					test: /\.js/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				}]
			},
			watch: true
		},
		webpackMiddleware: {
			noInfo: true
		}
	});
};