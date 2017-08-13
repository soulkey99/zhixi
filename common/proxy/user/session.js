/**
 * Created by MengLei on 2016-09-07.
 */
"use strict";
const model = require('./../../model');
const crypto = require('crypto');
/**
 * 根据session id获取记录
 * @param id
 * @returns {*}
 */
exports.getSessionByID = function *(id) {
    return yield model.UserSession.findById(id);
};

/**
 * 根据authSign获取session记录
 * @param authSign
 * @returns {*}
 */
exports.getByAuthSign = function *(authSign) {
    if (!authSign) {
        return null;
    }
    return yield model.UserSession.findOne({authSign, valid: true});
};

/**
 * 根据access_token获取session记录（只获取有效期内的有效记录）
 * @param token
 * @returns {*}
 */
exports.getByToken = function *(token) {
    if (!token) {
        return null;
    }
    return yield model.UserSession.findOne({
        access_token: token,
        valid: true,
        access_token_expire: {$gte: new Date()}
    });
};

/**
 * 根据refresh_token获取session记录（只获取有效期内的有效记录）
 * @param token
 * @returns {*}
 */
exports.getByRefreshToken = function *(token) {
    if (!token) {
        return null;
    }
    return yield model.UserSession.findOne({
        refresh_token: token,
        valid: true,
        refresh_token_expire: {$gte: new Date()}
    });
};

/**
 * 根据refresh_token或者access_token获取session记录，无论是否过期
 * @param param = {access_token: '', refresh_token: ''}
 * @returns {*}
 */
exports.getSession = function *(param) {
    let query = {};
    if (param.access_token) {
        query['access_token'] = param.access_token;
    }
    if (param.refresh_token) {
        query['refresh_token'] = param.refresh_token;
    }
    return yield model.UserSession.findOne(query);
};

/**
 * 根据access_token或者refresh_token获取下一条session记录
 * @param param
 * @returns {*}
 */
exports.getNextSession = function *(param) {
    let query = {};
    if (param.access_token) {
        query['access_token'] = param.access_token;
    }
    if (param.refresh_token) {
        query['refresh_token'] = param.refresh_token;
    }
    let session1 = yield model.UserSession.findOne(query);
    if (!session1) {
        return null;
    }
    return yield model.UserSession.findOne({
        userID: session1.userID,
        userType: session1.userType,
        type: session1.type,
        createdAt: {$gt: session1.createdAt}
    }).sort({createdAt: 1});
};

/**
 * 创建新的session，之前必须将所有旧session置为失效
 * @param param = {userID: '', type: '', userType: '',device: '', loginType: 'user/sso/guest'}
 * @returns {*}
 */
exports.create = function *(param) {
    yield model.UserSession.update({
        userID: param.userID,
        valid: true,
        type: param.type,
        userType: param.userType
    }, {$set: {valid: false}}, {multi: true});
    let session = new (model.UserSession)();
    session.userID = param.userID;
    session.userType = param.userType;
    session.type = param.type;
    session.access_token = crypto.randomBytes(24).toString('hex');
    session.access_token_expire = new Date(Date.now() + 7200000);    //设置7200秒有效期
    session.refresh_token = crypto.randomBytes(24).toString('hex');
    if (param.loginType == 'guest') {
        session.refresh_token_expire = new Date(Date.now() + 31536000000);//游客登陆有效期一年
    } else {
        session.refresh_token_expire = new Date(Date.now() + 2592000000);//设置30天有效期
    }
    session.device = param.device;
    return yield session.save();
};

