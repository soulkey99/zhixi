/**
 * Created by MengLei on 2016-09-07.
 */
"use strict";
const Router = require('koa-router');
const config = require('./../../config');
const session = require('koa-generic-session');
const store = require('koa-redis');

let router = new Router();
router.use(session({   //session settings for redis
    key: 'sk.zhixi.session',
    prefix: 'SKZhixi:AdminServer:Session:',
    ttl: 3600000,   //session有效期一个小时
    rolling: true,  //每次请求重置session有效期
    store: store({  //session存储位置，redis
        host: config.redisConfig.host,
        port: config.redisConfig.port
    }),
    cookie: {   //cookie设置
        path: '/',
        httpOnly: true,
        maxage: null,
        rewrite: true,
        signed: true
    }
}));

router.get('/get', function*(next) {
    this.body = this.session.userID;
});

router.get('/set', function *(next) {
    this.session.user = {user: 'aaa'};
    this.session.userID = 'aaa';
    this.body = 'set';
});

router.get('/reset', function *(next) {
    this.session.user = null;
    this.session.userID = null;
    this.body = 'ok';
});

router.get('/test', function *(next) {
    this.body = 'rest1';
});

module.exports = router;
