/**
 * Created by MengLei on 2016-08-29.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let UserTSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    authSign: {type: String, default: ''},
    phone: {type: String, default: ''},
    passwd: {type: String, default: ''},
    block_util: {type: Date, default: null},
    block_reason: {type: String, default: ''},
    nick: {type: String, default: ''},
    name: {type: String, default: ''},
    intro: {type: String, default: ''},
    avatar: {type: String, default: ''},
    type: {type: String, default: 'regUser'},
    delete: {type: Boolean, default: false},
    userInfo: {type: Schema.Types.Mixed, default: {}}
}, {timestamps: 1});

let UserTSSOSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    valid: {type: Boolean, default: true},
    type: {type: String, required: true},//weixin,weibo,qq
    wx_id: {type: String},
    openid: {type: String, default: ''},
    unionid: {type: String, default: ''},
    access_token: {type: String, default: ''},
    expire_at: {type: Date, default: null},
    refresh_token: {type: String, default: ''},
    refresh_at: {type: Date, default: null},
    nick: {type: String, default: ''},
    avatar: {type: String, default: ''}
}, {timestamps: 1, id: false, read: 'sp'});

let MsgTSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'notice', enum: ['personal', 'system', 'broadcast']},    //个人消息（单人对单人发送），广播消息（系统对多人发送），系统消息（系统对单人发送）
    from: {type: Schema.Types.ObjectId},   //personal消息才有from，其余都是系统发送
    fromType: {type: String, enum: ['s', 't', 'p']},   //与from同时存在
    to: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, default: ''},
    read: {type: Boolean, default: false},
    readAt: {type: Date},
    param: {type: Schema.Types.Mixed, default: {}}  //携带参数
}, {timestamps: 1, id: false, read: 'sp'});

let TodoSchema = new Schema({ //待办事项
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'schedule'},
    userID: {type: Schema.Types.ObjectId, required: true},
    startAt: {type: Date, required: true},
    endAt: {type: Date, required: true},
    valid: {type: Boolean, default: true},
    school_id: {type: Schema.Types.ObjectId, required: true},
    class_id: {type: Schema.Types.ObjectId, required: true}
}, {read: 'sp'});

UserTSchema.plugin(BaseModel);
MsgTSchema.plugin(BaseModel);
TodoSchema.plugin(BaseModel);

UserTSchema.virtual('userID').get(function () {
    return this._id.toString();
});
TodoSchema.virtual('todo_id').get(function () {
    return this._id.toString();
});

UserTSchema.method('toInfo', function () {
    return {
        userID: this._id.toString(),
        nick: this.nick,
        phone: this.phone,
        intro: this.intro,
        avatar: this.avatar,
    }
});
UserTSchema.method('toSimpleInfo', function () {
    return {
        userID: this._id.toString(),
        nick: this.nick,
        name: this.name,
        avatar: this.avatar
    }
});
UserTSchema.method('setPwd', function *(newPwd) {
    return yield mongoose.model('UserT').findByIdAndUpdate(this._id, {$set: {passwd: newPwd}}, {new: true});
});
MsgTSchema.method('toItem', function *() {
    let info = {
        msg_id: this._id.toString(),
        type: this.type,
        to: this.to.toString(),
        content: this.content,
        param: this.param,
        createdAt: this.createdAt
    };
    if (this.from) {
        info['from'] = this.from.toString();
        info['fromType'] = this.fromType;
        let from = yield (this.fromType == 's' ? mongoose.model('UserS') : this.fromType == 't' ? mongoose.model('UserT') : mongoose.model('UserP')).findById(this.from);
        info.fromNick = from ? from.nick : '';
    }
    return info;
});

TodoSchema.index({userID: 1, startAt: 1});

mongoose.model('UserT', UserTSchema, 'usert');
mongoose.model('MsgT', MsgTSchema, 'msgt');
mongoose.model('UserTSSO', UserTSSOSchema, 'usertsso');
mongoose.model('Todo', TodoSchema, 'usertTodo');

