const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // Must require webpack itself

module.exports = {
  // Set the mode to development for a fast, unoptimized build with helpful errors
  mode: 'development',

  // 1. Entry Point: Where Webpack starts building the dependency graph
  entry: './src/index.tsx', // Adjust this path to your main entry file (e.g., index.jsx)

  // 2. Output: Where Webpack puts the bundled files
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Clears the 'dist' folder before each build
  },

  // 3. Modules (Loaders): How to process non-JS files (like React/JSX, CSS)
  module: {
    rules: [
      {
        // Rule for .js and .jsx files (our React code)
        test: /\.(js|jsx|ts|tsx)$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // Rule for .css files
        test: /\.css$/,
        // The loaders are used right to left
        use: ['style-loader', 'css-loader'],
      },
      // You would add more rules here for images, fonts, etc.
    ],
  },

  // 4. Plugins: Perform actions on bundles (like generating HTML)
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your existing index.html
      filename: 'index.html',
    }),

    // <<< ADD THE PROVIDE PLUGIN HERE
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      // ADD PROCESS POLYFILL HERE
      process: 'process/browser',
    }),
  ],

  // 5. Webpack Dev Server Configuration
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve content from 'dist'
    },
    port: 3000, // Or whatever port you prefer
    hot: true, // Enable Hot Module Replacement
    historyApiFallback: true, // Necessary for client-side routing (e.g., React Router)
  },

  // Add the fallback section here
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
        // Critical Fix for react-router (.mjs)
        "process/browser": "process/browser.js", 
      
        // Fallbacks/Aliases for other Node core modules
        "process": "process/browser.js", // Also alias the bare name
        "stream": "stream-browserify",
        "buffer": "buffer/",
        "events": "events",
       },
    fallback: {
      // Tells Webpack to use stream-browserify whenever 'stream' is imported
      "stream": require.resolve("stream-browserify"),

      // Add the new buffer polyfill
      "buffer": require.resolve("buffer/"),

      "events": require.resolve("events/"),

      "process": require.resolve("process"),
    },

  },

};