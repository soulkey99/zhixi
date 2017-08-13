/**
 * Created by MengLei on 2016-08-29.
 */
"use strict";
const app = require('koa')();
const http = require('http');
const path = require('path');
const https = require('https');
const qs = require('querystring');
const session = require('koa-generic-session');
const store = require('koa-redis');
const config = require('./../config');
const router = require('koa-router')();
const rest = require('./rest');
const rest2 = require('./rest2');

app.use(function*(next) {   //http logger
    if (this.path.indexOf('/rest') == 0) {  //for rest api
        try {
            yield next;
        } catch (ex) {//global catch internal server error
            logger.trace(`method: ${this.method}, status: ${this.status}, code: 905, msg: ${ex.message}, path: ${this.path}, query: ${qs.stringify(this.query)}, body: ${JSON.stringify(this.request.body)}`);
            return result(this, {code: 905, msg: `服务器内部错误，${ex.message}`}, 500);
        }
        if (!this.body) {
            this.status = 404;
            this.body = {code: 911, msg: '请求的资源不存在！'};
        }
        //file logger
        logger.trace(`method: ${this.method}, status: ${this.status}, code: ${this.body.code}, path: ${this.path}, has_auth: ${!!this.header.auth}, query: ${JSON.stringify(this.query)}, body: ${JSON.stringify(this.request.body)}`);
    } else {    //for static files
        yield next;
        // logger.trace(`status: ${this.status}, request: ${this.path}?${qs.stringify(this.query)}`);
    }
});

app.keys = ['SKZhixiAdminSessionSecretKeys'];  //session sign key

// router.use(session({   //session settings for redis
//     key: 'sk.zhixi.session',
//     prefix: 'SKZhixi:AdminServer:Session:',
//     ttl: 3600000,   //session有效期一个小时
//     rolling: true,  //每次请求重置session有效期
//     store: store({  //session存储位置，redis
//         host: config.redisConfig.host,
//         port: config.redisConfig.port
//     }),
//     cookie: {   //cookie设置
//         path: '/rest',
//         httpOnly: true,
//         maxage: null,
//         rewrite: true,
//         signed: true
//     }
// }));


app.use(require('koa-static')(path.join(__dirname, 'public'), {index: 'login.html'})); //static path

// app.use(function *(next) {
//     if (this.path == '/rest/login') {
//         yield next;
//     } else if (this.path.indexOf('/rest') == 0 && !this.session.user) {
//         return result(this, {code: 903, message: '登陆信息失效，请重新登陆！'});
//     }
//     yield next;
// });

router.use('/rest', require('koa-body')(), rest.routes()); //main route
router.use('/rest2', require('koa-body')(), rest2.routes()); //main route
app.use(router.routes()/*, router.allowedMethods()*/);


http.createServer(app.callback()).listen(config.port.admin, err=> {
    if (err) {
        return console.log(`http server init error: ${err.message}`);
    }
    logger.fatal(`http server listening at port: ${config.port.admin}`);
    console.log(`http server listening at port: ${config.port.admin}`);
});

//graceful exit with closing db connection
process.on('SIGINT', ()=> {
    require('mongoose').disconnect();
    logger.fatal('server exit.');
    console.log('[FATAL] server exit.');
    process.exit(1);
});

//import some global method
global.validator = require('validator');    //字符校验
global.proxy = require('./../common/proxy/index');
global.result = require('./../utils/result');
global.logger = require('./../utils/logs').admin;

