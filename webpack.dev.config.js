const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var devConfig = {
	entry: [
		'./src/App.js'
	],
	output: {
		// 把所有依赖的模块合并输出到一个 bundle.js 文件
		filename: 'js/[name].js',
		// 输出文件都放到 dist 目录下
		path: __dirname + './dist',
		chunkFilename: 'js/chunks/[name].js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
			    test: /\.(js|jsx)$/,
			    exclude: /(node_modules|bower_components)/,
			    use: {
			    	loader: "babel-loader",
			    	options: {
			    		presets: [
			    			'env', 'react'
			    		]
			    	}
			    }
	    	},
	      	{
	       		// 用正则去匹配要用该 loader 转换的 CSS 文件
	        	test: /\.css$/,
	        	use: ['style-loader', 'css-loader?minimize'],
	      	},
	      	// font-awesome
	      	{
	      		test: /\.(eot|svg|ttf|woff|woff2|otf)\w*/,
	      		loader: 'url-loader?limit=100000000'
	      	},
	      	{
	      		test: /\.(png|jpeg|gif|jpg)$/,
	      		loader: 'url-loader?limit=25000'
	      	}
      	]
	},
	plugins: [
  		
		new HtmlWebpackPlugin({
			/*
			 * Reference: https://webpack.js.org/plugins/html-webpack-plugin
			 * Render index.html
			 * The HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles.
			 * This is especially useful for webpack bundles that include a hash in the filename which changes every compilation.
			 * You can either let the plugin generate an HTML file for you, supply your own template using lodash templates, or use your own loader.
			 */
			filename: 'index.html',
			template: __dirname + '/index.html',
			inject: 'body',
		}),
		/*
		 * Reference: https://webpack.js.org/plugins/named-modules-plugin
		 * This plugin will cause the relative path of the module to be displayed when HMR is enabled.
		 * Suggested for use in development.
		 */
		new webpack.NamedModulesPlugin(),
		
  		new webpack.HotModuleReplacementPlugin(), //热加载插件
		
		/*
		 * Reference: https://www.npmjs.com/package/clean-webpack-plugin
		 * Clean old dist files
		 * verbose(true): Write logs to console.
		 * dry(false): remove files
		 */
		new CleanWebpackPlugin(['dist'], {
			root: __dirname,
			verbose: true,
			dry: false
		})
  	],
  	devServer: {
  		contentBase: "./dist",
  		historyApiFallback: true, // true for index.html upon 404, object for multiple paths
  		hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
  		compress: true, // enable gzip compression
  		host: 'localhost',
  		port:9000
  	}
}

module.exports = devConfig;
