/**
 * Created by MengLei on 2016-08-25.
 */
"use strict";

//mongodb配置
exports.db = {
    base: process.env.NODE_ENV == 'production' ? '' : 'mongodb://127.0.0.1:27017',
    path: process.env.NODE_ENV == 'production' ? '' : '/byzhixi_test',
    user_path: process.env.NODE_ENV == 'production' ? '' : '/byserver'
};

// exports.db = {
//     base: 'mongodb://byzhixi:byzhixi@127.0.0.1:3718',
//     path: '/byzhixi',
//     user_path: '/byserver'
// };

//leancloud配置
exports.sms_config = {
    'X-LC-Id': '',
    'X-LC-Key': '',
    'Content-Type': 'application/json'
};

exports.url = {  //url配置
    api: process.env.NODE_ENV == 'production' ? 'api.zx..com' : 'api.test.zx..com',
    file: process.env.NODE_ENV == 'production' ? 'api.zx..com' : 'api.test.zx..com',
    admin: process.env.NODE_ENV == 'production' ? 'api.zx..com' : 'api.test.zx..com',
    mqtt: process.env.NODE_ENV == 'production' ? 'api.zx..com' : 'api.test.zx..com'
};

//微信登陆配置
exports.wx_config = {
    mp_app_id: process.env.NODE_ENV == 'production' ? '' : '',
    mp_app_secret: process.env.NODE_ENV == 'production' ? '' : '',
    // mp_app_id: '',
    // mp_app_secret: '',
    mp_token: '',
    open_app_id: '',
    open_app_secret: ''
};

//百度LBS云ak
exports.bd_ak = '';

//redis 配置
let redisConfig = {
    host: '127.0.0.1',
    port: 6379
};
const redis = require('then-redis');
exports.redisConfig = redisConfig;
exports.redis = redis.createClient({host: '127.0.0.1', port: 6379});

//端口配置
exports.port = {
    admin: 8050,
    app: 8051,
    file: 8052,
    web: 8053
};

//随机数生成器
exports.rack = require('hat').rack();

//oss key
exports.oss_config = {
    key: '',
    secret: '',
    bucket: '',
    prefix: 'http://oss..com/'
};

//qiniu key
exports.qiniu_conf = {
    key: '',
    secret: '',
    bucket: '',
    prefix: ''
};

