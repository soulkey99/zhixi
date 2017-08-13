/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
const app = require('koa')();
const http = require('http');
const path = require('path');
const qs = require('querystring');
const store = require('koa-redis');
const session = require('koa-generic-session');
const config = require('./../config');
const router = require('koa-router')();
const xmlParser = require('koa-xml-body').default;
const rest = require('./rest');
const xml = require('./rest/xml');

//http logger
app.use(function*(next) {   //http logger and common error handler
    if (this.path.indexOf('/rest') == 0 || this.path.indexOf('/webrest') == 0) {  //for rest api
        try {
            yield next;
        } catch (ex) {//global catch internal server error
            // logger.trace(`method: ${this.method}, status: ${this.status}, code: 905, msg: ${ex.message}, path: ${this.path}, query: ${qs.stringify(this.query)}, body: ${JSON.stringify(this.request.body)}`);
            result(this, {code: 905, msg: `服务器内部错误，${ex.message}`}, 500);
        }
        if (!this.body) {
            result(this, {code: 911, msg: '请求的资源不存在！'}, 404);
        }
        //file logger
        logger.trace(`method: ${this.method}, status: ${this.status}, code: ${this.body.code + `${this.body.code != 900 ? ', msg: ' + this.body.msg : ''}`}, path: ${this.path}, has_auth: ${!!this.header.auth}, query: ${JSON.stringify(this.query)}, body: ${JSON.stringify(this.request.body)}`);
        //db logger
        if (!!process.env.NODE_ENV) {
            proxy.Log.httpLog({
                userID: this.state.userID,
                reqIP: this.header['x-real-ip'] || this.ip,
                reqHeader: this.header,
                method: this.method,
                reqPath: this.path,
                reqParams: this.params,
                reqQuery: this.query,
                reqBody: this.request.body,
                resHeader: this.response.header,
                resStatus: this.status,
                resBody: this.body
            });
        }
    } else {    //for static files
        yield next;
        logger.trace(`status: ${this.status}, request: ${this.path}?${qs.stringify(this.query)}`);
    }
});
app.use(function *(next) {
    //为了兼容某些不标准的content-type，将最末尾的分号去除掉
    if (this.header['content-type']) {
        if (this.header['content-type'].lastIndexOf(';') == this.header['content-type'].length - 1) {
            this.header['content-type'] = this.header['content-type'].substr(0, this.header['content-type'].length - 1);
        }
    }
    yield next;
});

app.use(require('koa-static')(path.join(__dirname, 'public'))); //static path

//for pc web browser, use cookies for keep session
app.keys = ['SKZhixiAppSessionSecretKeys'];  //session sign key
router.use(session({   //session settings for redis, used only for route /webrest
    key: 'sk.zhixi.session',
    prefix: 'SKZhixi:AppServer:WebSession:',
    ttl: 30 * 24 * 3600 * 1000,   //session有效期一个月
    rolling: true,  //每次请求重置session有效期
    store: store({  //session存储位置，redis
        host: config.redisConfig.host,
        port: config.redisConfig.port
    }),
    cookie: {   //cookie设置
        path: '/webrest',   //session只对webrest路径有效
        httpOnly: true,
        maxage: null,
        rewrite: true,
        signed: true
    }
}));


// router.use('/webrest/:userType',  //pc web route: body parser, rest router
//     function *(next) {
//         if (this.path == '/webrest/login') {
//             yield next;
//         } else if (this.path.indexOf('/webrest') == 0 && !this.session.user) {
//             return result(this, {code: 903, msg: '登陆信息失效，请重新登陆！'});
//         }
//         this.state = this.session;  //将session上面挂载的内容转移到state上面，便于与app的操作兼容
//         yield next;
//     },
//     require('koa-body')(),
//     rest.routes()
// );

// app.use(xmlParser());

// router.use('/xml', (require('koa-xml-body').default)(), xml.routes());
router.use('/xml', xmlParser(), xml.routes());

router.use('/rest', function *(next) {
    this.set('Access-Control-Allow-Origin', '*');
    yield next;
}, require('koa-body')(), rest.restRouter.routes());
router.use('/webrest', function *(next) {
    this.header.platform = 'web';
    if (this.path == '/webrest/s/login' || this.path == '/webrest/t/login' || this.path == '/webrest/p/login') {
        yield next;
    } else if (this.path.indexOf('/webrest') == 0 && !this.session.user) {
        return result(this, {code: 903, msg: '登陆信息失效，请重新登陆！'}, 401);
    } else if ((this.path.indexOf('/webrest/s/') == 0 && this.session.userType != 's') || (this.path.indexOf('/webrest/t/') == 0 && this.session.userType != 't') || (this.path.indexOf('/webrest/p/') == 0 && this.session.userType != 'p')) {
        //守护路径，只有登录用户类型与访问类型相同的清空下，才继续，否则会提示用户登录信息失效
        return result(this, {code: 903, msg: '登录信息失效，请重新登录！'}, 401);
    }
    this.state.user = this.session.user;  //将session上面挂载的内容转移到state上面，便于与app的操作兼容
    this.state.userID = this.session.userID;
    yield next;
}, require('koa-body')(), rest.webRouter.routes());
// router.use('/:restType',  //main route: body parser, rest router
//     function *(next) {  //cors options for rest apis
//         if (this.params.restType == 'rest') {   //for mobile app
//             this.set('Access-Control-Allow-Origin', '*');
//             yield next;
//         } else if (this.params.restType == 'webrest') { //for pc web
//             this.header.platform = 'web';
//             if (this.path == '/webrest/s/login' || this.path == '/webrest/t/login' || this.path == '/webrest/p/login') {
//                 yield next;
//             } else if (this.path.indexOf('/webrest') == 0 && !this.session.user) {
//                 return result(this, {code: 903, message: '登陆信息失效，请重新登陆！'});
//             }
//             this.state.user = this.session.user;  //将session上面挂载的内容转移到state上面，便于与app的操作兼容
//             this.state.userID = this.session.userID;
//             yield next;
//         } else {
//             yield next;
//         }
//     },
//     require('koa-body')(),
//     rest.routes()
// );

app.use(router.routes());

http.createServer(app.callback()).listen(config.port.app, '0.0.0.0', err => {
    if (err) {
        return console.log(`http server init error: ${err.message}`);
    }
    logger.fatal(`http server listening at port: ${config.port.app}`);
    console.log(`http server listening at port: ${config.port.app}`);
});
//graceful exit with closing db connection
process.on('SIGINT', () => {
    require('mongoose').disconnect();
    logger.fatal('server exit.');
    console.log('[FATAL] server exit.');
    process.exit(1);
});

//on start, init some task
require('./utils/task');

//import some global method
global.validator = require('validator');    //字符校验
global.proxy = require('./../common/proxy/index');
global.result = require('./../utils/result');
global.logger = require('./../utils/logs').http;
