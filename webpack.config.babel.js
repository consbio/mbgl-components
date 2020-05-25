import path from 'path'

export default {
    mode: 'production',
    devtool: 'source-map',
    entry: './lib/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    output: {
        filename: 'mbgl-components.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'mbglComponents'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules')
        ]
    },
    externals: ['mapbox-gl', 'react', 'react-dom', 'uuid'],
    optimization: {
        minimize: false
    }
}
