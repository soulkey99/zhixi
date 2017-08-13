/**
 * Created by MengLei on 2016-09-08.
 */
"use strict";
const redis = require('./../../config').redis;
const qs = require('querystring');

//用户登录状态验证，header中放置一个auth字符串，格式为userID=xxx&session_id=xxx，并对其进行base64编码
//强制校验登陆状态，如果没传或者传错，直接返回错误
exports.required = function *(next) {
    let auth = this.header.auth;
    if (!auth) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
    if (!q.userID || !q.authSign) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let session = yield getSessionByAuthSign(q.authSign);
    if (!session) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    if (session.userID != q.userID) {  //第一次校验错误，需要先删除一遍session缓存再校验一次
        yield redis.del(`SKZhixi:AppServer:RestSession:${q.authSign}`);
        session = yield getSessionByAuthSign(q.authSign);
        if (session.userID != q.userID) {
            return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
        }
    }
    if (session.block_util && new Date(session.block_util) > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
    }
    this.state.userID = q.userID;
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
    if (!q.userID && !q.authSign) {
        return yield next;
    }
    let session = yield getSessionByAuthSign(q.authSign);
    if (!session) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    if (session.userID != q.userID) {  //第一次校验错误，需要先删除一遍session缓存再校验一次
        yield redis.del(`SKZhixi:AppServer:RestSession:${q.authSign}`);
        session = yield getSessionByAuthSign(q.authSign);
        if (session.userID != q.userID) {
            return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
        }
    }
    if (session.block_util && new Date(session.block_util) > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
    }
    this.state.userID = q.userID;
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
        let session = yield getSessionByAuthSign(q.authSign);
        if (session) {
            this.state.userID = session.userID;
        }
    } catch (ex) {
        yield next;
    }
    yield next;
};

//获取session信息，如果redis缓存中没有，则从数据库中查询并保存在缓存中
function *getSessionByAuthSign(authSign) {
    let session = yield redis.get(`SKZhixi:AppServer:RestSession:${authSign}`);
    if (!session) {
        session = yield proxy.UserSession.getByAuthSign(authSign);
        if (session && session.valid) {
            session = session.toInfo();
            let user = yield proxy.User.getUserById(session.userID, session.userType);
            session.block_util = user.block_util;
            yield redis.set(`SKZhixi:AppServer:RestSession:${authSign}`, JSON.stringify(session));
            yield redis.expire(`SKZhixi:AppServer:RestSession:${authSign}`, 1800);//半个小时session cache
        }
    } else {
        try {
            session = JSON.parse(session);
        } catch (ex) {
            yield redis.del(`SKZhixi:AppServer:RestSession:${authSign}`);
            session = yield getSession(authSign);
        }
    }
    return session;
}
function *getSession(session_id) {
    let session = yield redis.get(`SKZhixi:AppServer:RestSession:${session_id}`);
    if (!session) {
        session = yield proxy.UserSession.getSessionByID(session_id);
        if (session && session.valid) {
            session = session.toInfo();
            let user = yield proxy.User.getUserById(session.userID, session.userType);
            session.block_util = user.block_util;
            yield redis.set(`SKZhixi:AppServer:RestSession:${session_id}`, JSON.stringify(session));
            yield redis.expire(`SKZhixi:AppServer:RestSession:${session_id}`, 1800);//半个小时session cache
        }
    } else {
        try {
            session = JSON.parse(session);
        } catch (ex) {
            yield redis.del(`SKZhixi:AppServer:RestSession:${session_id}`);
            session = yield getSession(session_id);
        }
    }
    return session;
}
