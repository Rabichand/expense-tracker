// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry file (adjust if needed)
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js', // Output file name
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,   // Apply Babel to all JavaScript/JSX files
        exclude: /node_modules/,  // Don't transpile node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Babel presets for modern JS and React
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Make sure .jsx and .js files can be imported without extensions
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),  // Your static files directory
    compress: true,
    port: 3000,  // Frontend port
  },
};
