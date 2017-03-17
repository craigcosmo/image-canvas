'use strict'

let webpack = require('webpack')
let	path = require('path')

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['mocha'],
		files: [
			'./spec/*.spec.js'
		],
		preprocessors: {
			'./spec/*.spec.js': ['webpack']
		},
		webpack: {
			module: {
				rules: [
					{
						test: /\.(js|jsx)$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {presets: ['es2015']}
						}
					}
				]
			},
			resolve: {
				modules: ['node_modules'],
			},
			externals: {
				'jsdom': 'window',
				'cheerio': 'window',

			},
		},
		webpackMiddleware: {
			noInfo: true
		},
		plugins: [
			'karma-webpack',
			'karma-jasmine',
			'karma-mocha',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-verbose-reporter',
		],
		reporters: ['verbose','progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_ERROR,
		autoWatch: true,
		browsers: ['Chrome']
	})
}
