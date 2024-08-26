const path = require('path');

module.exports = {
    entry: {
        content: './src/content.js',  // Entry point for content script
        sidebar: './src/sidebar.js',   // Entry point for sidebar script
        background: './src/background.js'  // Entry point for background script
    },
    output: {
        path: path.resolve(__dirname, 'dist'),  // Output directory
        filename: '[name].bundle.js'            // Output file naming pattern
    },
    module: {
        rules: [
            {
                test: /\.js$/,                // Apply this rule to .js files
                exclude: /node_modules/,      // Exclude files in node_modules directory
                use: {
                    loader: 'babel-loader',     // Use babel-loader to transpile files
                    options: {
                        presets: ['@babel/preset-env']  // Use @babel/preset-env for latest JavaScript features
                    }
                }
            }
        ]
    },
    mode: 'production'  // Set Webpack mode to 'production' for optimized output
};
