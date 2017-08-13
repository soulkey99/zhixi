/**
 * Created by MengLei on 2016-11-10.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let WXMsgSchema = new Schema({
    //['ToUserName', 'FromUserName', 'CreateTime', 'MsgType', 'Content', 'MsgId', 'PicUrl', 'MediaId', 'Format', 'Recognition', 'ThumbMediaId', 'Location_X', 'Location_Y', 'Scale', 'Label', 'Description', 'Url'];
    _id: {type: String},
    toUserName: {type: String, required: true},
    fromUserName: {type: String, required: true},
    msgType: {type: String, required: true},//消息类型，text：文字消息，voice：语音消息，video：视频消息，shortvideo：小视频消息，location：位置消息，link：链接消息，event：推送事件
    event: {type: String},//事件类型：subscribe/unsubscribe：订阅、取消订阅，SCAN：已关注用户扫描二维码，LOCATION：上报地理位置，CLICK：点击菜单，VIEW：点击菜单跳转链接事件
    eventKey: {type: String},//事件的key值，
    ticket: {type: String}, //二维码的ticket，可以用于换取二维码
    createTime: {type: Date, required: true},
    content: {type: String},
    picUrl: {type: String},
    mediaId: {type: String},
    format: {type: String},
    recognition: {type: String},
    thumbMediaId: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    precision: {type: Number},
    location_X: {type: Number},
    location_Y: {type: Number},
    scale: {type: Number},
    label: {type: String}
}, {timestamps: 1, read: 'sp'});

let WXQRSchema = new Schema({   //记录微信二维码
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    userType: {type: String, default: 's', enum: ['s', 't', 'p']},
    expireAt: {type: Date, required: true},
    scene_id: {type: Number, required: true},
    ticket: {type: String, required: true},
}, {timestamps: 1, read: 'sp'});

let NewsItemSchema = new Schema({
    title: {type: String, required: true},   //图文消息标题
    description: {type: String, required: true},   //图文消息描述
    url: {type: String, required: true},   //图文消息点击跳转的链接
    picurl: {type: String, required: true}   //图文消息显示的图片链接
}, {id: false, _id: false});
let WXPushSchema = new Schema({   //记录服务端发给微信的消息
    _id: {type: Schema.Types.ObjectId},
    openid: {type: String},
    type: {type: String}, //default: 'other', enum: ['subscribe', 'unsubscribe', 'bind', 'unbind', 'lastFeedback', 'lastHomework', 'other']},
    msgType: {
        type: String,
        default: 'text',
        enum: ['text', 'image', 'voice', 'video', 'music', 'news', 'mpnews', 'wxcard']
    },
    content: {type: String},   //文本消息的内容
    media_id: {type: String},   //发送的图片、语音、视频、图文消息的媒体ID
    thumb_media_id: {type: String}, //缩略图的媒体ID
    title: {type: String},   //视频消息、音乐消息的标题
    description: {type: String},   //视频消息、音乐消息的描述
    musicurl: {type: String},    //音乐链接
    hqmusicurl: {type: String},   //高品质音乐的链接，wifi环境优先使用该链接
    card_id: {type: String},    //微信卡券的ID
    kf_account: {type: String}, //客服账号ID
    news: {type: NewsItemSchema}   //图文消息数组，限制在8条以内
}, {timestamps: 1, read: 'sp'});

WXMsgSchema.plugin(BaseModel);
WXPushSchema.plugin(BaseModel);
WXQRSchema.plugin(BaseModel);

WXMsgSchema.virtual('msgId').get(function () {
    return this._id.toString();
});

WXMsgSchema.index({createdAt: -1});

mongoose.model('WXMsg', WXMsgSchema, 'wxmsg');
mongoose.model('WXPush', WXPushSchema, 'wxpush');
mongoose.model('WXQRCode', WXQRSchema, 'wxQRCode');
