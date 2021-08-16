
const { ProvidePlugin } = require('webpack');

module.exports = {
  context: __dirname,
  entry: './client/index.js',
  output: {
    path: require('path').resolve(__dirname, 'server', 'public', 'js'),
    filename: 'index.js',
    clean: true
  },
  // plugins: [
  //   new ProvidePlugin({
  //     process: 'process/browser',
  //   }),
  // ],
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      },
      exclude: /node_modules/
    }],
  },
  mode: 'production',
};