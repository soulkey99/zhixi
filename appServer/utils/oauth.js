/**
 * Created by MengLei on 2016-09-09.
 */
"use strict";
const redis = require('./../../config').redis;
const qs = require('querystring');

//用户登录状态验证，header中放置一个auth字符串，格式为userID=xxx&access_token=xxx，并对其进行base64编码
//强制校验登陆状态，如果没传或者传错，直接返回错误
exports.required = function *(next) {
    if ((this.header.platform && this.header.platform.toLowerCase() == 'web')) {
        return yield next;
    }
    let auth = this.header.auth;
    if (!auth) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
    if (!q.access_token) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let session = yield getSessionByToken(q.access_token);
    if (!session) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    if (!session.valid) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    if (session.userType != this.path[6]) {
        return result(this, {code: 903, msg: '用户类型错误，无权访问该接口！'}, 401);
    }
    if (new Date(session.access_token_expire) < Date.now()) {
        return result(this, {code: 899, msg: '您的access_token已经超时！'}, 400);
    }
    if (session.block_util && new Date(session.block_util) > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 401);
    }
    //理论上不需要验证userID，只通过access_token就能确定用户的身份，从session中直接获取用户的userID
    this.state.userID = session.userID;
    yield next;
};


//可选校验登陆状态，如果客户端传了则必须校验通过，如果没传则直接next
exports.optional = function *(next) {
    let auth = this.header.auth;
    if (!auth) {
        yield next;
        return;
    }
    let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
    if (!q.access_token) {
        return yield next;
    }
    let session = yield getSessionByToken(q.access_token);
    if (!session) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    if (!session.valid) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    if (new Date(session.access_token_expire) < Date.now()) {
        return result(this, {code: 899, msg: '您的access_token已经超时！'}, 400);
    }
    if (session.block_util && new Date(session.block_util) > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 401);
    }
    this.state.userID = session.userID;
    yield next;
};

//仅提取userID，不校验authSign
exports.checkUser = function *(next) {
    let auth = this.header.auth;
    if (!auth) {
        return yield next;
    }
    try {
        let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
        let session = yield getSessionByToken(q.access_token);
        if (session) {
            this.state.userID = session.userID;
        }
    } catch (ex) {
        yield next;
    }
    yield next;
};

//获取session信息，如果redis缓存中没有，则从数据库中查询并保存在缓存中
function *getSessionByToken(token) {
    let session = yield redis.get(`SKZhixi:AppServer:RestSession:${token}`);
    if (!session) {
        session = yield proxy.UserSession.getByToken(token);
        if (session && session.valid) {
            session = session.toInfo();
            let user = yield proxy.User.getUserById(session.userID, session.userType);
            session.block_util = user.block_util;
            yield redis.set(`SKZhixi:AppServer:RestSession:${token}`, JSON.stringify(session));
            yield redis.expire(`SKZhixi:AppServer:RestSession:${token}`, 1800);//半个小时session cache
        }
    } else {
        try {
            session = JSON.parse(session);
        } catch (ex) {
            yield redis.del(`SKZhixi:AppServer:RestSession:${token}`);
            session = yield getSessionByToken(token);
        }
    }
    return session;
}
