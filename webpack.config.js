const ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {

    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {minimize: true}
                }
            }, {
                loader: ExtractTextPlugin.extract({
                    fallback: require.resolve('style-loader'),
                    use: [
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                camelCase: true,
                                context: __dirname,
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                                minimize: true,
                                modules: true
                            }
                        }, {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                plugins: [
                                    require('autoprefixer')
                                ]
                            }
                        },
                        require.resolve('sass-loader')
                    ]
                }),
                test: /\.mod\.scss$/
            }, {
                loader: require.resolve('ignore-loader'),
                test: /\.spec\.js$/
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: `style.[hash].css`
        })
    ]
}
