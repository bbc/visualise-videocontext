const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'visualise-videocontext.bundle.js',
        libraryTarget: 'umd',
        library: 'visualise-videocontext',
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre',
            },
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            // },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: /src/,
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules'),
        ],
    },
}
