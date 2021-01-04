const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJs = require('uglifyjs-webpack-plugin');
const os = require('os');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        app: './src/view/index.tsx'
    },
    output: {
        path: path.resolve('./lib'),
        libraryTarget: 'umd',
        library: 'TmsLogin'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: [
                    {
                        loader: 'ts-loader'
                    },
                    process.env.node === 'production' && {
                        loader: 'eslint',
                        options: {
                            fix: true
                        }
                    }
                ].filter(Boolean),
                include: [
                    path.resolve('./src'),
                    path.resolve('./node_modules/build-dev-server-client')
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file',
                options: {
                    name: 'assets/image/[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'file',
                options: {
                    name: 'assets/media/[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file',
                options: {
                    name: 'assets/font/[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.less/,
                use: [
                    {
                        loader: 'style'
                    },
                    {
                        loader: 'css'
                    },
                    {
                        loader: 'less',
                        options: {
                            javaEnabled: true,
                            javascriptEnabled: true
                        }
                    }
                ]
            }
        ]
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', 'less'],
        alias: {
            src: path.resolve('./src'),
            model: path.resolve('./src/model'),
            view: path.resolve('./src/view'),
            component: path.resolve('./src/component'),
            router: path.resolve('./src/router'),
            assets: path.resolve('./public/assets'),
            utils: path.resolve('./src/utils')
        }
    },
    optimization: {
        minimizer: [
            new UglifyJs({
                parallel: os.cpus().length,
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log'] // 移除console
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ]
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    plugins: [
        new CleanPlugin([path.resolve('./lib')], { allowExternal: true })
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // })
    ],
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react'
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom'
        },
        antd: 'antd'
    }
};
