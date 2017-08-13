/**
 * Created by MengLei on 2016-08-29.
 */
"use strict";
const API = require('co-wechat-api');
const OAuth = require('co-wechat-oauth');
const request = require('request');
const config = require('./../../config').wx_config;
const baseUrl = 'https://api.weixin.qq.com/';
const redis = require('./../../config').redis;

let api = new API(config.mp_app_id, config.mp_app_secret, function *() {
    let res = yield [
        redis.get('SKZhixi:wx:mp_access_token'),
        redis.get('SKZhixi:wx:mp_access_token_expire')
    ];
    return {accessToken: res[0], expireTime: new Date(res[1]).getTime()};
}, function *(token) {
    yield [redis.set('SKZhixi:wx:mp_access_token', token.accessToken),
        redis.set('SKZhixi:wx:mp_access_token_expire', new Date(token.expireTime).toJSON())
    ]
});

let oauth = new OAuth(config.mp_app_id, config.mp_app_secret);
// let oauth = new OAuth(config.mp_app_id, config.mp_app_secret, function *() {
//     let res = yield [
//         redis.get('SKZhixi:wx:mp_access_token'),
//         redis.get('SKZhixi:wx:mp_access_token_expire')
//     ];
//     return {accessToken: res[0], expireTime: new Date(res[1]).getTime()};
// }, function *(token) {
//     yield [redis.set('SKZhixi:wx:mp_access_token', token.accessToken),
//         redis.set('SKZhixi:wx:mp_access_token_expire', new Date(token.expireTime).toJSON())
//     ]
// });

api.registerTicketHandle(function *() {
    let res = yield [
        redis.get('SKZhixi:wx:mp_js_ticket'),
        redis.get('SKZhixi:wx:mp_js_ticket_expire')
    ];
    return {ticket: res[0], expireTime: new Date(res[1]).getTime()};
}, function *(type, ticket) {
    yield [
        redis.set('SKZhixi:wx:mp_js_ticket', ticket.ticket),
        redis.set('SKZhixi:wx:mp_js_ticket_expire', new Date(ticket.expireTime).toJSON())
    ];
});
exports.api = api;
exports.oauth = oauth;
oauth.checkCode = function *(code) {
    let res = yield req({   //code 换取 openid和accessToken
        url: `${baseUrl}sns/oauth2/access_token?appid=${config.mp_app_id}&secret=${config.mp_app_secret}&code=${code}&grant_type=authorization_code`,
        method: 'GET',
        json: true
    });
    if (res.errcode) {
        throw(new Error('授权失败！'));
    }
    return res;
    // let res2 = yield req({  //openid和accessToken换取userinfo
    //     url: `${baseUrl}sns/userinfo?access_token=${res.access_token}&openid=${res.openid}&lang=zh_CN`,
    //     method: 'GET',
    //     json: true
    // });
    // if (res2.errcode == 48001) {//对于accessToken和openid获取userinfo返回48001错误，一般都是scope=snsapi_base造成的，这里重定向到scope=snsapi_userinfo去让用户手动授权即可
    //     return result(this, {
    //         code: 914,
    //         url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.mp_app_id + "&redirect_uri=" + encodeURIComponent(uncode(this.header['referer'])) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
    //     });
    // }
    // if (res2.errcode) {
    //     return result(this, {code: 913, msg: '授权失败！', info: res}, 400);
    // }
    //
    // this.request.body.ssoType = 'weixin';
    // this.request.body.openid = res.openid;
    // this.request.body.access_token = res.access_token;
    // this.request.body.refresh_token = res.refresh_token;
    // res.nick = res2.nickname;
    // res.avatar = res2.headimgurl;
    // res.unionid = res2.unionid;
    // yield next;
};
exports.checkUser = function *(openid, access_token) {   //校验微信登陆传过来的openid和accessToken是否有效，如果有效，直接获取用户的信息并返回
    let res1 = yield req({
        url: `${baseUrl}sns/auth?access_token=${access_token}&openid=${openid}`,
        method: 'GET',
        json: true
    });
    let res = {valid: !res1.errcode, nick: '', avatar: '', unionid: '', errmsg: res1.errmsg};
    if (!res.valid) {
        return res;
    }
    let res2 = yield req({
        url: `${baseUrl}sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`,
        method: 'GET',
        json: true
    });
    res.nick = res2.nickname;
    res.openid = res2.openid;
    res.avatar = res2.headimgurl;
    res.unionid = res2.unionid;
    return res;
};
/**
 * 给指定用户发送单独的消息
 * @param param = {userType: '', userID: '', openid: '', msg: ''}
 */
exports.sendMsg = function *(param) {
    let openid = '';
    if (param.openid) {  //有openid就直接使用，没有的话再通过userID去获取
        openid = param.openid;
    } else {
        switch (param.userType) {
            case 'p': {
                openid = yield proxy.Parent.getOpenID({userID: param.userID, type: 'wxauth'});
            }
                break;
            default:
                return;
                break;
        }
    }
    proxy.WXMsg.onPush({
        openid,
        msgType: 'text',
        content: param.msg
    });
    if (!openid) {
        return;
    }
    yield api.sendText(openid, param.msg);
};

/**
 * 发送图文消息
 * @param param = {userType: '', userID: '', openid: '', }
 */
exports.sendNewsMsg = function *(param) {
    let articleArr = [{title: param.title, description: param.description, url: param.url, picurl: param.picurl}];
    let openid = '';
    if (param.openid) {
        openid = param.openid;
    } else {
        switch (param.userType) {
            case 'p': {
                openid = yield proxy.Parent.getOpenID({userID: param.userID, type: 'wxauth'});
            }
                break;
            default:
                return;
                break;
        }
    }
    proxy.WXMsg.onPush({
        openid,
        msgType: 'news',
        news: articleArr
    });
    if (!openid) {
        return;
    }
    yield api.sendNews(openid, articleArr);
};

//thunkify request
function req(opt, callback) {   //thunkify request
    return function (callback) {
        request(opt, (err, res, body)=> {
            callback(err, body);
        });
    }
}
