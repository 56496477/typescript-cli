import tmsRequest from 'tms-request';

export const $http = tmsRequest.create({
    timeout: 500000
});

/**
 create 方法配置
 {
    //是否要过滤Null值与Undefined 默认值为false
    filter: false ,
    //是否要添加防缓存随机数 默认为false
    cache: false ,
    //响应拦截器 加载于内置响应拦截器前 请谨慎使用 使用后请完整返回修改过后的response
    responseInterceptor: response => response ,
    //请求拦截器 加载于内置请求拦截器前 请谨慎使用 使用后请完整返回修改过后的config
    requestInterceptor: config => config ,
    //默认请求方法 默认为get 即使用$http.request的使用在不传入method时执行的请求动作
    method: 'get' ,
    //请求url前缀
    baseURL: '/ccp-web' ,
    //默认要携带的请求头
    headers: {
        'TMS-TOKEN': 'SSSSS'
    } ,
    //超时时间 默认为5秒
    timeout: 5000 ,
    //上传进度回调 建议在请求级别配置添加
    onUploadProgress: progressEvent => progressEvent ,
    //下载进度回调 建议在请求级别配置添加
    onDownloadProgress: progressEvent => progressEvent
    //还有更多配置项 请参考axios官方文档 翻阅配置api
}

 */
