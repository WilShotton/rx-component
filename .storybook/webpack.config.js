
module.exports = {
    module: {
        rules: [
            {
                test: /\.mod\.scss$/,
                loaders: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            camelCase: true,
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        },
                    },
                    require.resolve('sass-loader')
                ]
            }
        ]
    }
}
