// Настроить сборку webpack - build/bundle.js
// через babel с пресетом env
// Линтинг JS eslint (airbnb - https://gist.github.com/maksugr/ab12fbb6c7c31d6281edc810d5f4d5c1)
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './source/client/index.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js'
	},
	// watch: true,
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}
		]
	},
	plugins: [
		// new HtmlWebpackPlugin({
		// 	favicon: '/public/favicon.ico',
		// })
	]
};
