/**
 * Created by MengLei on 2016-11-11.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('./../baseModel');

let SessionSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userType: {type: String, default: 's', enum: ['s', 't', 'p']},
    type: {type: String, default: 'unknown', enum: ['mobile', 'web', 'wap', 'sso', 'unknown']},
    loginType: {type: String, default: 'user', enum: ['user', 'sso', 'guest']},
    userID: {type: Schema.Types.ObjectId, required: true},
    authSign: {type: String},
    access_token: {type: String, required: true},
    access_token_expire: {type: Date, required: true},
    refresh_token: {type: String, required: true},
    refresh_token_expire: {type: Date, required: true},
    device: {type: String, default: ''},
    valid: {type: Boolean, default: true}
}, {timestamps: 1});

let MsgSchema = new Schema({    //公共广播消息
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'broadcast'},
    to: {type: String, enum: ['s', 't', 'p', 'all']},//向学生、教师、家长、所有人
    content: {type: String, default: ''},
    param: {type: Schema.Types.Mixed, default: {}}
}, {timestamps: 1, id: false});


SessionSchema.plugin(BaseModel);
MsgSchema.plugin(BaseModel);


SessionSchema.virtual('session_id', function () {
    return this._id.toString();
});

SessionSchema.method('toInfo', function () {
    return {
        session_id: this.session_id,
        userType: this.userType,
        type: this.type,
        loginType: this.loginType,
        userID: this.userID.toString(),
        authSign: this.authSign,
        access_token: this.access_token,
        access_token_expire: this.access_token_expire,//有效期7200秒
        refresh_token: this.refresh_token,
        refresh_token_expire: this.refresh_token_expire,//有效期30天
        device: this.device,
        valid: this.valid,
        createdAt: this.createdAt
    };
});

SessionSchema.index({access_token: 1});
SessionSchema.index({refresh_token: 1});
SessionSchema.index({updatedAt: 1}, {expireAfterSeconds: 3600 * 24 * 365});  //365天后session自动删除
SessionSchema.index({createdAt: 1});
MsgSchema.index({createdAt: 1});

mongoose.model('UserSession', SessionSchema, 'userSession');
mongoose.model('Msg', MsgSchema, 'msg');

