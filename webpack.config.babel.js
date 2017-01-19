import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import path from 'path';
import parseArgs from 'minimist';

const ENV = process.env.NODE_ENV || 'development';
const CSS_MAPS = ENV !== 'production';
const cliArgs = parseArgs(process.argv.slice(2));

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: [
		// 'babel-polyfill', // @TODO this is adding some KB
		'./index.js'
	],
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: 'bundle.js'
	},

	resolve: {
		extensions: [
			'', '.jsx', '.js', '.json'
		],
		modulesDirectories: [
			path.resolve(__dirname, 'node_modules'),
			'node_modules'
		]
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				exclude: path.resolve(__dirname, 'src'),
				loader: 'source-map'
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
		]
	},

	plugins: ([
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(ENV)})
	])

	.concat(ENV==='production' ? [
		// strip out babel-helper invariant checks
		new ReplacePlugin([{
			// this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
			partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
			replacement: () => 'return;('
		}])
	] : []),

	stats: {
		colors: true
	},
	
	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	}
};
