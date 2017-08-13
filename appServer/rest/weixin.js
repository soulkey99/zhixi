/**
 * Created by MengLei on 2016-08-30.
 */
"use strict";
const config = require('./../../config').wx_config;
const url_config = require('./../../config').url;
const url = require('url');
const co = require('co');
const wxUtil = require('./../utils/weixin');
const wxMsg = require('./../utils/wxMsg');

//微信web端jssdk需求的ticket
exports.js_config = function *(next) {
    let origin_url = this.header['referer'];
    if (!origin_url) {
        origin_url = this.request.query.origin_url;
    }
    let res = yield wxUtil.api.getJsConfig({
        debug: process.env.NODE_ENV != 'production',
        // debug: false,
        url: origin_url
    });
    return result(this, {
        code: 900, nonceStr: res.nonceStr,
        debug: process.env.NODE_ENV != 'production',
        auth_url: wxUtil.oauth.getAuthorizeURL(uncode(origin_url), 'state', 'snsapi_userinfo'),
        timestamp: res.timestamp,
        signature: res.signature,
        appId: config.mp_app_id,
        jsApiList: res.jsApiList
    });
};

exports.oauth = function *(next) {
    let token = yield wxUtil.oauth.checkCode(this.request.query.code);
    let user_info = yield wxUtil.checkUser(token.openid, token.access_token);
    //console.log(user_info);
    //token = {data: {access_token: '', expires_in: '', refresh_token: '', open_id: '', scope: '', unionid: '', created_at: ''}}
    //user_info = {nick: '', avatar: '', unionid: ''}
    this.request.body = {  //模拟登录post body
        ssoType: 'wxauth',
        openid: token.openid,
        access_token: token.access_token
    };
    yield next;
};

//
exports.redirect = function *(next) {
    let url = this.request.query.url || this.header['referer'];
    let scope = this.request.scope || 'snsapi_base';
    this.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.mp_app_id + "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect");
};

exports.echo = function *(next) {
    let body = this.request.query;
    return result(this, body.echostr, 200);
};

//接受微信服务端发送过来的webhook
exports.webhook = function *(next) {
    let body = this.request.body.xml;
    let wxBody = parseMsg(body);  //解析请求
    proxy.WXMsg.onMsg(wxBody);    //将请求保存到数据库中
    onWXMsg(wxBody);
    return result(this, "", 200);
};
exports.onWXMsg = onWXMsg;

function onWXMsg(param) {
    co(function *() {
        switch (param.msgType) {
            case 'event':   //相应event事件
                yield onWXEvent(param);
                break;
            default:
                // yield wxUtil.sendMsg({openid: param.fromUserName, msg: '功能开发中，暂时无法使用！'});
                break;
        }
    }).then(resp => {
        //
    }).catch(ex => {
        logger.error('exception: ' + ex.message);
    });
}

function *onWXEvent(param) {
    switch (param.event) {
        case 'subscribe':
            yield wxUtil.sendMsg({openid: param.fromUserName, msg: '欢迎关注索课数学，唯一专注中考的评测。点击这里  http://w.url.cn/s/Am6dfHJ  立刻进行多维度评测！'});
            break;
        case 'unsubscribe':
            break;
        case 'SCAN':   //扫描二维码
            break;
        case 'scancode_push':
            break;
        case 'LOCATION':   //上报地理位置
            break;
        case 'CLICK':  //相应CLICK操作
            yield onWXEventClick(param);
            break;
        case 'VIEW':   //启动页面
            break;
        default:
            yield wxUtil.sendMsg({openid: param.fromUserName, msg: '功能开发中，暂时无法使用！'});
            break;
    }
}

function *onWXEventClick(param) {
    let sso = yield proxy.Parent.getSSOByOpenID({openid: param.fromUserName, ssoType: 'wxauth'});
    if (!sso) {
        yield wxUtil.sendMsg({openid: param.fromUserName, msg: '请先登录并绑定学生！'});
        return;
    }
    let stus = yield proxy.Parent.getStudent({userID: sso.userID});
    if (stus.length == 0) {
        yield wxUtil.sendMsg({openid: param.fromUserName, msg: '尚未绑定学生，请先绑定！'});
        return;
    }
    switch (param.eventKey) {
        case 'LAST_FEEDBACK':   //上次反馈
        {
            let feedback = yield proxy.Parent.lastFeedback({userID: sso.userID});
            yield wxUtil.sendMsg({openid: param.fromUserName, msg: feedback ? feedback.content : '暂无反馈！'});
        }
            break;
        case 'LAST_HOMEWORK':  //上次作业
            let homework = yield proxy.Parent.lastHomework({userID: sso.userID});
            if (!homework) {
                yield wxUtil.sendMsg({openid: param.fromUserName, msg: '暂无作业！'});
            }
            let res = yield [
                proxy.School.getClassByID(homework.class_id),
                proxy.School.getScheduleByID(homework.schedule_id)
            ];
            yield wxUtil.sendNewsMsg({
                openid: param.fromUserName,
                title: '最近的一次作业',
                description: `班级：${res[0].name}，第${res[1].seq}课时，提交截止时间：${homework.endAt.getFullYear() + '/' + (homework.endAt.getMonth() + 1) + '/' + homework.endAt.getDate()}，一共${homework.questions.length}道题！`,
                url: `https://${url_config.api}/rest/p/wx/redirect?url=https://${url_config.api}/zhixiP/homeworkList.html?swork_id=${homework.swork_id}`, //'https://api.test.zx.soulkey99.com/rest/p/wx/redirect?url=https://api.test.zx.soulkey99.com/zhixiP/homeworkList.html',
                picurl: 'http://oss.soulkey99.com/zhixi/2016-11-10/89fd89cd157ca4def8d3964b9f966222.jpg'
            });
            break;
        default:
            yield wxUtil.sendMsg({openid: param.fromUserName, msg: '功能开发中，暂时无法使用！'});
            break;
    }
}

//特殊功能，将url中querystring的code参数去掉，其他部分全都保留
function uncode(p) {
    let u = url.parse(p, true);
    delete(u.query.code);
    delete(u.search);
    return url.format(u);
}

//解析微信post消息的xml数据
function parseMsg(xml) {
    let wxBody = {};
    // let objProps = ['ToUserName', 'FromUserName', 'CreateTime', 'MsgType', 'Content', 'MsgId', 'PicUrl', 'MediaId', 'Format', 'Recognition', 'ThumbMediaId', 'Location_X', 'Location_Y', 'Scale', 'Label', 'Description', 'Url'];
    Object.keys(xml).forEach(i => {
        if (xml[i]) {
            if (i == 'CreateTime') {
                xml[i][0] = new Date(parseInt(xml[i][0]) * 1000);
            }
            wxBody[i.substr(0, 1).toLowerCase() + i.substr(1, i.length - 1)] = xml[i][0];
        }
    });
    return wxBody;
}

