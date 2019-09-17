var path = require('path');

module.exports = {
	watch: true,
  entry: './js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};