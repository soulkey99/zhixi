/**
 * Created by MengLei on 2016-08-29.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let UserPSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    authSign: {type: String, default: ''},
    phone: {type: String, default: ''},
    passwd: {type: String, default: ''},
    block_util: {type: Date, default: null},
    block_reason: {type: String, default: ''},
    nick: {type: String, default: ''},
    name: {type: String, default: ''},
    type: {type: String, default: 'regUser'},
    intro: {type: String, default: ''},
    avatar: {type: String, default: ''},
    delete: {type: Boolean, default: false},
    userInfo: {type: Schema.Types.Mixed, default: {}}
}, {timestamps: 1});

let UserPSSOSchema = new Schema({
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
}, {timestamps: 1});

let MsgPSchema = new Schema({
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

let ParentStudentSchema = new Schema({  //记录家长与学生的关系
    _id: {type: Schema.Types.ObjectId},
    s_id: {type: Schema.Types.ObjectId, required: true},
    p_id: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, enum: ['add', 'apply'], default: 'add'}, //add：家长添加
    status: {type: String, enum: ['pending', 'verified', 'rejected'], default: 'verified'},
    valid: {type: Boolean, default: true}
}, {timestamps: 1, read: 'sp'});


UserPSchema.plugin(BaseModel);
UserPSSOSchema.plugin(BaseModel);
MsgPSchema.plugin(BaseModel);
ParentStudentSchema.plugin(BaseModel);


UserPSchema.virtual('userID').get(function () {
    return this._id.toString();
});
ParentStudentSchema.virtual('ps_id').get(function () {
    return this._id.toString();
});

UserPSchema.method('toInfo', function () {
    return {
        userID: this._id.toString(),
        nick: this.nick,
        phone: this.phone,
        intro: this.intro,
        avatar: this.avatar,
    }
});
UserPSchema.method('setPwd', function *(newPwd) {
    return yield mongoose.model('UserP').findByIdAndUpdate(this._id, {$set: {passwd: newPwd}}, {new: true});
});
MsgPSchema.method('toItem', function *() {
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
ParentStudentSchema.method('toStudentInfo', function *() {
    let stu = yield mongoose.model('UserS').findById(this.s_id);
    return {
        s_id: stu.userID,
        s_nick: stu.nick,
        s_avatar: stu.avatar,
        s_name: stu.name
    };
});
ParentStudentSchema.method('toParentInfo', function *() {
    let p = yield mongoose.model('UserP').findById(this.p_id);
    return {
        p_id: p.userID,
        p_nick: p.nick,
        p_avatar: p.avatar,
        p_name: p.name
    }
});


mongoose.model('UserP', UserPSchema, 'userp');
mongoose.model('MsgP', MsgPSchema, 'msgp');
mongoose.model('UserPSSO', UserPSSOSchema, 'userpsso');
mongoose.model('ParentStudent', ParentStudentSchema, 'parentStudent');



