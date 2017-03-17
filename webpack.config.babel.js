import webpack from 'webpack'
import OpenBrowserPlugin from 'open-browser-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import path from 'path'


let port = 1122
let env = process.env.NODE_ENV
let sourceMap = 'source-map'
let buildFolder = 'dist'
let publicPath = 'http://localhost:'+port+'/'


export default {
	stats:'minimal',
	devtool: sourceMap,
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, buildFolder),
		publicPath: publicPath
	},
	devServer: {
		contentBase: buildFolder,
		port: port,
		noInfo: true,
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
		]
	},
	resolve: {
		modules: ['node_modules']
	},
	plugins: [
		new OpenBrowserPlugin({ 
			url: 'http://localhost:'+port, 
			browser: 'google chrome'
		}),
		new ProgressBarPlugin({
			format: 'build... :percent'
		})
	]
}
