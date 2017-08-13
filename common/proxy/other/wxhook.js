/**
 * Created by MengLei on 2016-11-10.
 */
"use strict";
/**
 * 接收消息，记录数据库
 * @param wxMsg
 */
exports.onMsg = function (wxMsg) {
    let msg = new (model.WXMsg)(wxMsg);
    msg._id = wxMsg.msgId;
    msg.save();
};

/**
 * 通过微信发送消息给用户，记录消息历史
 * @param param = {openid: ''}
 */
exports.onPush = function (param) {
    let push = new (model.WXPush)();
    push.openid = param.openid;
    if (param.type) {
        push.type = param.type;    //发送消息的目的，subscribe/unsubscribe/bind/unbind/lastFeedback/lastHomework
    }
    push.msgType = param.msgType;   //消息类型，text/image/voice/video/music/news/mpnews/wxcard
    switch (param.msgType) {
        case 'text': {  //文字消息
            push.content = param.content;
        }
            break;
        case 'image':
        case 'mpnews':
        case 'voice': {   //图片、语音消息，mpnews：图文消息，点击跳转到图文消息页面
            push.media_id = param.media_id;
        }
            break;
        case 'video': {     //视频消息
            push.media_id = param.media_id;
            push.thumb_media_id = param.thumb_media_id;
            push.title = param.title;
            push.description = param.description;
        }
            break;
        case 'music': {     //音乐消息
            push.title = param.title;
            push.description = param.description;
            push.musicurl = param.musicurl;
            push.hqmusicurl = param.hqmusicurl;
            push.thumb_media_id = param.thumb_media_id;
        }
            break;
        case 'news': {
            push.news = param.news;
        }
            break;
        case 'wxcard': {
            push.card_id = param.card_id;
        }
            break;
        default:
            break;
    }
    if (param.kf_account) {
        push.kf_account = param.kf_account;
    }
    push.save();
};
