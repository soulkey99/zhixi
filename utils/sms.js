/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
const request = require('request');
const config = require('../config');
const log = require('./logs');

exports.middle = function *(next) {
    let phone = this.request.body.phone || this.state.user.phone;
    let smscode = this.request.body.smscode;
    if (!phone) {
        return result(this, {code: 904, msg: '缺少phone字段！'}, 400);
    }
    if (!validator.isNumeric(smscode)) {
        return result(this, {code: 603}, 400);
    }
    if (process.NODE_ENV != 'production') {
        if (smscode == '123123') {
            yield next;
            return;
        }
    }
    let opt = {
        url: `https://leancloud.cn/1.1/verifySmsCode/${smscode}?mobilePhoneNumber=${phone}`,
        method: 'POST',
        json: true,
        headers: config.sms_config
    };
    let res = yield req(opt);
    if (!res[1].code) {
        yield next;
    } else {
        return result(this, {code: res[1].code, msg: res[1].error || '短信验证码校验失败'}, res[0].statusCode);
    }
};

exports.check = function *(phone, smscode) {
    if (process.NODE_ENV != 'production') {
        if (smscode == '123123') {
            return {};
        }
    }
    let opt = {
        url: `https://leancloud.cn/1.1/verifySmsCode/${smscode}?mobilePhoneNumber=${phone}`,
        method: 'POST',
        json: true,
        headers: config.sms_config
    };
    let res = yield req(opt);
    return res[1];
};

exports.get = function *(next) {
    let body = {mobilePhoneNumber: this.request.body.phone, smsType: this.request.body.smsType, template: 'smscode'};
    // let body = {mobilePhoneNumber: this.request.body.phone, smsType: this.request.body.smsType};
    let opt = {
        url: 'https://api.leancloud.cn/1.1/requestSmsCode',
        method: 'POST',
        headers: config.sms_config,
        json: true,
        body: body
    };
    let res = yield req(opt);
    if (!res[1].code) {
        return result(this, {code: 900});
    } else {
        return result(this, {code: res[1].code, msg: res[1].error || '获取短信验证码失败'}, res[0].statusCode);
    }
};

exports.send = function *(param) {
    let body = {
        mobilePhoneNumber: param.phone
    };
    delete(param.phone);
    Object.assign(body, param);
    let opt = {
        url: 'https://api.leancloud.cn/1.1/requestSmsCode',
        method: 'POST',
        headers: config.sms_config,
        json: true,
        body: body
    };
    let res = yield req(opt);
    return res[1];
};

function req(opt, callback) {
    return function (callback) {
        request(opt, callback);
    }
}

