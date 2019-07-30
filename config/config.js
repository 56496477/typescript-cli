const {DevUtil} = require('./utils');
const {resolve} = require('path');



exports.globalConfig ={
    host: DevUtil.getLocalHost() ,
    publicPath: DevUtil.getPublicPath() ,
    port: 9090,
    needOverlay:true,
    outputPath: resolve('dist')
};


