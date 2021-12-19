const webpack = require('webpack');
const { resolve } = require('path');
const { globalConfig } = require('./config/config');
const { DevUtil } = require('./config/utils');
const { env } = require('./config/env');
const { proxy } = require('./config/proxy');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

class WebpackConfig {
    constructor(BUILD_ENV = 'local') {
        if (BUILD_ENV === 'local') {
            process.env.NODE_ENV = 'development';
        } else {
            process.env.NODE_ENV = 'production';
        }
        this.NODE_ENV = process.env.NODE_ENV;
        this.BUILD_ENV = BUILD_ENV;
    }

    get optimization() {
        if (this.NODE_ENV === 'development') return;
        return {
            splitChunks: {
                name: 'vendors',
                chunks: 'initial'
            },
            runtimeChunk: {
                name: 'runtime'
            },
            minimize: true,
            minimizer: [
                new TerserPlugin(),
                new CssMinimizerPlugin({
                    parallel: true
                })
            ]
        };
    }

    get plugins() {
        const { NODE_ENV, BUILD_ENV } = this;
        const { outputPath, publicPath, host, port } = globalConfig;
        const commonPlugins = [
            new webpack.DefinePlugin(DevUtil.stringifyEnv(env[BUILD_ENV])),
            new webpack.ContextReplacementPlugin(
                /moment[\\\/]locale$/,
                /^\.\/(zh-cn|en-gb)$/
            )
        ];
        const envPlugins = {
            development: [
                ...commonPlugins,
                new webpack.HotModuleReplacementPlugin(),
                new HtmlWebpackPlugin({
                    template: resolve('./public/index.html'),
                    favicon: resolve('./public/favicon.ico'),
                    rootPath: '/'
                }),
                new FriendlyErrors({
                    compilationSuccessInfo: {
                        messages: [
                            `编译成功 运行于http://${host}:${port}${publicPath}`
                        ]
                    }
                })
            ],
            production: [
                ...commonPlugins,
                new CleanPlugin([outputPath], { allowExternal: true }),
                new MiniCssExtractPlugin({
                    filename: 'assets/style/[name].[contenthash:7].css',
                    chunkFilename: '[id].css',
                }),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: resolve('./public/index.html'),
                    rootPath: publicPath,
                    favicon: resolve('./public/favicon.ico'),
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true
                    }
                })
            ]
        };

        return envPlugins[NODE_ENV];
    }

    get resolve() {
        return {
            // extensions: ['.js', 'jsx','.css', 'less'],
            alias: {
                src: resolve('./src'),
                model: resolve('./src/model'),
                view: resolve('./src/view'),
                container: resolve('./src/container'),
                component: resolve('./src/component'),
                router: resolve('./src/router'),
                assets: resolve('./public/assets'),
                utils: resolve('./src/utils')
            }
        };
    }

    get resolveLoader() {
        return {
            // moduleExtensions: ['-loader']
            extensions: ['.ts', '.tsx'],
            modules: ['node_modules'],
            mainFields: ['loader', 'main'],
        };
    }

    get devServer() {
        const { publicPath, port, host } = globalConfig;
        return {
            static: {
                directory: resolve('./public'),
                staticOptions: {},
                publicPath,
                serveIndex: true,
                watch: true,
            },
            port,
            hot: true,
            host,
            open: [`${publicPath}`],
            proxy
        };
    }

    get devtool() {
        let devtool = false;
        if (this.BUILD_ENV === 'local') {
            devtool = 'cheap-module-source-map';
        } else if (env[this.BUILD_ENV].sourceMap) {
            devtool = 'source-map';
        }
        return devtool;
    }

    get module() {
        const cssLoader = {
            development: 'style',
            production: MiniCssExtractPlugin.loader
        };
        return {
            rules: [
                {
                    test: /\.tsx?$/i,
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                    ],
                    include: [
                        resolve('./src'),
                    ],
                    exclude: /node_modules/
                },
                {
                    exclude: [/\.(ts|tsx|js|mjs|jsx|html|json|less|css)$/],
                    type: 'asset/resource'
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: cssLoader[this.NODE_ENV]
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                },
                {
                    test: /\.less/,
                    use: [
                        {
                            loader: cssLoader[this.NODE_ENV]
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                javaEnabled: true,
                                javascriptEnabled: true
                            }
                        }
                    ]
                }
            ]
        };
    }

    get externals() {
        if (process.env.NODE_ENV === 'production') {
            return {
                react: 'React',
                'react-dom': 'ReactDOM',
                axios: 'axios',
                history: 'history',
                'react-router-dom': 'ReactRouterDOM',
                'styled-components': 'styled',
                trianglify: 'Trianglify',
                lodash: '_',
                moment: 'moment',
                antd: 'antd'
            };
        } else {
            return {};
        }
    }

    getConfig() {
        const { publicPath, outputPath } = globalConfig;
        const {
            NODE_ENV,
            plugins,
            devtool,
            devServer,
            module,
            optimization,
            externals,
            resolveLoader
        } = this;
        const filename = DevUtil.getOutputFileName(NODE_ENV);

        return {
            mode: NODE_ENV,
            entry: {
                app: resolve('src/index.tsx')
            },
            output: {
                filename,
                publicPath,
                chunkFilename: filename,
                path: outputPath
            },
            resolve: this.resolve,
            plugins,
            devServer,
            devtool,
            resolveLoader,
            module,
            optimization,
            externals
        };
    }
}

module.exports = new WebpackConfig(process.env.BUILD_ENV).getConfig();
