const webpack = require('webpack');
const { resolve } = require('path');
const { globalConfig } = require('./config/config');
const { DevUtil } = require('./config/utils');
const { env } = require('./config/env');
const { proxy } = require('./config/proxy');
const CleanPlugin = require('clean-webpack-plugin');
const CssToFile = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { loader: exLoader } = CssToFile;
const UglifyJs = require('uglifyjs-webpack-plugin');
const UglifyCss = require('optimize-css-assets-webpack-plugin');
const safeParser = require('postcss-safe-parser');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const os = require('os');

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
            minimizer: [
                new UglifyJs({
                    parallel: os.cpus().length,
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: true
                        },
                        output: {
                            comments: false
                        }
                    }
                }),
                new UglifyCss({
                    cssProcessorOptions: {
                        parser: safeParser,
                        discardComments: { removeAll: true }
                    }
                })
            ]
        };
    }

    get plugins() {
        const { NODE_ENV, BUILD_ENV } = this;
        const { outputPath, publicPath, host, port } = globalConfig;
        const commonPlugins = [
            //new webpack.IgnorePlugin(/^\.\/locale$/ , /moment$/) ,
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
                new HtmlPlugin({
                    template: resolve('./public/index.html'),
                    filename: 'index.html',
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
                new CssToFile({
                    filename: 'assets/style/[name].[contenthash:7].css',
                    allChunks: true
                }),
                new HtmlPlugin({
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
            extensions: ['.js', '.ts', '.css', 'less'],
            alias: {
                src: resolve('./src'),
                model: resolve('./src/model'),
                view: resolve('./src/view'),
                component: resolve('./src/component'),
                router: resolve('./src/router'),
                assets: resolve('./public/assets'),
                utils: resolve('./src/utils')
            }
        };
    }

    get resolveLoader() {
        return {
            moduleExtensions: ['-loader']
        };
    }

    get devServer() {
        const { publicPath, port, host } = globalConfig;
        return {
            contentBase: [resolve('./public')],
            port,
            publicPath,
            historyApiFallback: {
                rewrites: [
                    {
                        from: new RegExp(`^${publicPath}`),
                        to: `${publicPath}index.html`
                    }
                ]
            },
            compress: true,
            hot: true,
            host,
            open: true,
            openPage: publicPath.slice(1),
            inline: true,
            noInfo: true,
            quiet: true,
            clientLogLevel: 'none',
            overlay: globalConfig.needOverLay ?  {
                warnings: true,
                errors: true
            }:false,
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
        const common = {
            rules: [
                {
                    test: /\.ts?$/,
                    use: [
                        {
                            loader: 'ts-loader'
                        },
                        {
                            loader: 'eslint',
                            options: {
                                fix: true
                            }
                        }
                    ],
                    include: [
                        resolve('./src'),
                        resolve('./node_modules/build-dev-server-client')
                    ],
                    exclude: /node_modules/
                },
                {
                    exclude: [/\.(js|mjs|jsx|ts|tsx|html|json|less|css)$/],
                    use: [
                        {
                            loader: 'file',
                            options: {
                                name: 'assets/media/[name].[hash:8].[ext]'
                            }
                        }
                    ]
                }
            ]
        };

        const development = {
            rules: [
                ...common.rules,
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style'
                        },
                        {
                            loader: 'css'
                        }
                    ]
                },
                {
                    test: /\.less$/,
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
        };

        const production = {
            rules: [
                ...common.rules,
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: exLoader
                        },
                        {
                            loader: 'css'
                        }
                    ]
                },
                {
                    test: /\.less/,
                    use: [
                        {
                            loader: exLoader
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
        };

        const modules = {
            development,
            production
        };

        return modules[this.NODE_ENV];
    }

    getConfig() {
        const { publicPath, outputPath } = globalConfig;
        const {
            NODE_ENV,
            resolveLoader,
            plugins,
            devtool,
            devServer,
            module,
            optimization
        } = this;
        const filename = DevUtil.getOutputFileName(NODE_ENV);

        return {
            mode: NODE_ENV,
            entry: {
                app: resolve('src/index.ts')
            },
            output: {
                filename,
                publicPath,
                chunkFilename: filename,
                path: outputPath
            },
            resolve: this.resolve,
            resolveLoader,
            plugins,
            devServer,
            devtool,
            module,
            optimization
        };
    }
}

module.exports = new WebpackConfig(process.env.BUILD_ENV).getConfig();
