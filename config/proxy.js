const {globalConfig} = require('./config');

exports.proxy = [
    {
        //要代理的地址 此规则用！取反
        context: [ `!${globalConfig.publicPath}**` ] ,
        //要代理的目标 （默认开发环境）
        target: 'https://platform-dev.mobilemd.cn' ,
        //是否更改源
        changeOrigin: true ,
        //路径重写
        pathRewrite: {
            '^/$': ''
        } ,
        //cookie域名重写
        cookieDomainRewrite: globalConfig.host
    }
];
