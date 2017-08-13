/**
 * Created by MengLei on 2016-08-30.
 */
"use strict";
const redis = require('./../../config').redis;
const qs = require('querystring');

//用户登录状态验证，header中放置一个auth字符串，格式为userID=xxx&session_id=xxx，并对其进行base64编码
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
    if (!q.userID || !q.authSign || !validator.isMongoId(q.userID) || !validator.isMongoId(q.authSign)) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let user = yield getUser(q.userID, this.params.userType);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (user.authSign != q.authSign) {  //第一次校验错误，需要先删除一遍session缓存再校验一次
        yield redis.del('SKZhixi:session:' + q.userID);
        user = yield getUser(q.userID, this.params.userType);
        if (user.authSign != q.authSign) {
            return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
        }
    }
    if (user.block_util && new Date(user.block_util) > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
    }
    this.state.userID = q.userID;
    this.state.user = user;
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
    if (!q.userID || !q.authSign) {
        return yield next;
    }
    if (!validator.isMongoId(q.userID)) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let user = yield getUser(q.userID, this.params.userType);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (user.authSign != q.authSign) {
        yield redis.del('SKZhixi:session:' + q.userID);
        user = yield getUser(q.userID, this.params.userType);
        if (user.authSign != q.authSign) {
            return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
        }
    }
    if (user.block_util && new Date(user.block_util) > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
    }
    this.state.userID = q.userID;
    this.state.user = user;
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
        if (q.userID && validator.isMongoId(q.userID)) {
            let user = yield getUser(q.userID, this.params.userType);
            if (user) {
                if (user.block_util && new Date(user.block_util) > Date.now()) {
                    return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
                }
                this.state.userID = q.userID;
                this.state.user = user;
            }
        }
    } catch (ex) {
        yield next;
    }
    return yield next;
};

//获取user信息，如果缓存中没有，则从数据库中查询并保存在缓存中
function *getUser(userID, userType) {
    let user = yield redis.get(`SKZhixi:AppServer:RestSession:${userType}:${userID}`);
    if (!user) {
        switch (userType) {
            case 't':
                user = yield proxy.Teacher.getUserById(userID);
                break;
            case 's':
                user = yield proxy.Student.getUserById(userID);
                break;
            case 'p':
                user = yield proxy.Parent.getUserById(userID);
                break;
        }
        if (user) {
            user = user.toObject({getters: true});
            yield redis.set('SKZhixi:session:' + userID, JSON.stringify(user));
            yield redis.expire('SKZhixi:session:' + userID, 1800);
        }
    } else {
        try {
            user = JSON.parse(user);
        } catch (ex) {
            yield redis.del('SKZhixi:session:' + userID);
            user = yield getUser(userID, userType);
        }
    }
    return user;
}
