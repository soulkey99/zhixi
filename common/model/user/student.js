/**
 * Created by MengLei on 2016-08-29.
 */
"use strict";
const mongoose = require('mongoose');
const byConn = require('../index').byConn;
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let UserInfoSchema = new Schema({
    city: {type: String, default: ''},
    school: {type: String, default: ''},
    version: {type: String, default: ''},
    grade: {type: String, default: ''},
    stage: {type: String, default: ''},
    target: {type: Number, default: 0}
}, {_id: false});

let UserSSchema = new Schema({
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
    userInfo: {type: UserInfoSchema, default: {}}
}, {timestamps: 1});

let UserSSSOSchema = new Schema({
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

let StudentTargetSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, enum: ['score', 'school', 'rank'], required: true},    //分数，学校，名次
    grade: {type: String},
    score: {type: Number},
    target_score: {type: Number},
    school: {type: String},
    rank: {type: Number},
    target_rank: {type: Number},
    target_school: {type: String}
}, {timestamps: 1});

let MsgSSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'system', enum: ['personal', 'system', 'broadcast']},    //个人消息（单人对单人发送），广播消息（系统对多人发送），系统消息（系统对单人发送）
    from: {type: Schema.Types.ObjectId},   //personal消息才有from，其余都是系统发送
    fromType: {type: String, enum: ['s', 't', 'p']},   //与from同时存在
    to: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, default: ''},
    read: {type: Boolean, default: false},
    readAt: {type: Date},
    param: {type: Schema.Types.Mixed, default: {}}  //携带参数
}, {timestamps: 1, id: false, read: 'sp'});

let RecentSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'exercise', enum: ['exercise', 'homework']},
    userID: {type: Schema.Types.ObjectId, required: true},
    swork_id: {type: Schema.Types.ObjectId},    //针对homework
    sec_id: {type: Schema.Types.ObjectId},      //针对exercise
    q_id: {type: Schema.Types.ObjectId},
    endAt: {type: Date},    //对于homework，要有endAt截止时间
    ver_id: {type: Schema.Types.ObjectId},  //对于exercise，要有ver_id教材版本信息
    param: {type: Schema.Types.Mixed, default: {}}
}, {timestamps: 1, id: false, read: 'sp'});

let StudentStatSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    questions: {
        total: {type: Number, default: 0},
        perfect: {type: Number, default: 0},
        excellent: {type: Number, default: 0},
        pass: {type: Number, default: 0},
        fail: {type: Number, default: 0}
    }
}, {timestamps: 1, id: false, read: 'sp'});

UserSSchema.plugin(BaseModel);
MsgSSchema.plugin(BaseModel);
UserSSSOSchema.plugin(BaseModel);
StudentTargetSchema.plugin(BaseModel);
RecentSchema.plugin(BaseModel);
StudentStatSchema.plugin(BaseModel);

UserSSchema.virtual('userID').get(function () {
    return this._id.toString();
});
MsgSSchema.virtual('msg_id').get(function () {
    return this._id.toString();
});
RecentSchema.virtual('recent_id').get(function () {
    return this._id.toString();
});

UserSSchema.method('toInfo', function () {
    return {
        userID: this._id.toString(),
        nick: this.nick,
        name: this.name,
        phone: this.phone,
        intro: this.intro,
        avatar: this.avatar,
        userInfo: {
            city: this.userInfo.city,
            school: this.userInfo.school,
            version: this.userInfo.version,
            grade: this.userInfo.grade,
            target: this.userInfo.target
        }
    }
});

UserSSchema.method('setPwd', function *(newPwd) {
    return yield mongoose.model('UserS').findByIdAndUpdate(this._id, {$set: {passwd: newPwd}}, {new: true});
});

UserSSchema.method('toSimpleInfo', function () {
    return {
        userID: this._id.toString(),
        nick: this.nick,
        name: this.name,
        avatar: this.avatar
    }
});

UserSSchema.method('toSimpleSInfo', function () {
    return {
        s_id: this._id.toString(),
        s_nick: this.nick,
        s_name: this.name,
        s_avatar: this.avatar
    }
});

MsgSSchema.method('toItem', function *() {
    let info = {
        msg_id: this._id.toString(),
        type: this.type,
        to: this.to.toString(),
        content: this.content,
        param: this.param,
        read: this.read,
        readAt: this.readAt,
        createdAt: this.createdAt
    };
    if (this.from) {
        info['from'] = this.from.toString();
        info['fromType'] = this.fromType;
        let from = yield (this.fromType == 's' ? mongoose.model('UserS') : this.fromType == 't' ? mongoose.model('UserT') : mongoose.model('UserP')).findById(this.from);
        info.fromNick = from ? from.nick : '';
    }
    if (this.param) {
        switch (this.param.type) {
            case 'homeworkFeedback': {
                let res = yield [
                    mongoose.model('Class').findById(this.param.class_id),
                    mongoose.model('ClassSchedule').findById(this.param.schedule_id)
                ];
                let t = yield mongoose.model('UserT').findById(res[0].t_id);
                info.param.class_name = res[0].name;
                info.param.seq = res[1].seq;
                info.param.t_id = res[0].t_id;
                info.param.t_name = t.name;
                info.param.t_avatar = t.avatar;
                info.param.t_nick = t.nick;
            }
                break;
        }
    }
    return info;
});

/**
 * param = {type: '', userID: '', q_id: '', swork_id: '', sec_id: ''}
 */
RecentSchema.static('addRecent', function *(param) {
    let query = {userID: param.userID};
    let setObj = {};
    if (param.type == 'homework') {
        query['type'] = 'homework';
        let swork = yield mongoose.model('StudentHomework').findById(param.swork_id);
        query['swork_id'] = param.swork_id;
        setObj['endAt'] = swork.endAt;
        setObj['q_id'] = param.q_id;
    } else {
        query['type'] = 'exercise';
        let chapter = yield byConn.model('StudyChapter').findOne({sections: param.sec_id});
        query['ver_id'] = chapter.ver_id;
        setObj['sec_id'] = param.sec_id;
        setObj['q_id'] = param.q_id;
    }
    return yield this.findOneAndUpdate(query, {$set: setObj}, {upsert: true, new: true});
});

RecentSchema.method('toListItem', function *() {
    let item = {
        recent_id: this._id.toString(),
        type: this.type,
        userID: this.userID,
        q_id: this.q_id,
        avatar: '',
        param: this.param
    };
    if (item.type == 'homework') {
        item.swork_id = this.swork_id;
        let swork = yield mongoose.model('StudentHomework').findById(item.swork_id);
        let res = [
            yield mongoose.model('Class').findById(swork.class_id),
            yield mongoose.model('ClassSchedule').findById(swork.schedule_id)
        ];

        item.class_id = swork.class_id;
        item.class_name = res[0].name;
        item.subject = res[0].subject;
        item.version = res[0].version;
        item.grade = res[0].grade;
        item.total = swork.questions.length;
        item.seq = res[1].seq;
        item.homework_desc = res[1].homework_desc || `第${res[1].seq}节课的作业。`;
        item.finished = 0;
        for (let i = 0; i < swork.questions.length; i++) {
            if (swork.questions[i].status == 'finished') {
                item.finished++;
            }
        }
        item.endAt = this.endAt;
    } else if (item.type == 'exercise') {
        item.ver_id = this.ver_id;
        item.sec_id = this.sec_id;
        let res = yield [
            byConn.model('StudySection').findById(item.sec_id),
            byConn.model('StudyVersion').findById(item.ver_id)
        ];
        item.version = res[1].version;
        item.stage = res[1].stage;
        item.grade = res[1].grade;
        item.subject = res[1].subject;
        item.ver_type = res[1].type;
        item.ver_title = res[1].title;
        item.avatar = res[1].cover;
        item.sec_title = res[0].title;
    }
    return item;
});

StudentStatSchema.method('toInfo', function *() {
    return {
        userID: this.userID,
        questions: {
            total: this.questions.total,
            perfect: this.questions.perfect,
            excellent: this.questions.excellent,
            pass: this.questions.pass,
            fail: this.questions.fail
        },
        createdAt: this.createdAt
    }
});

StudentStatSchema.static('calculate', function *(userID) {
    let users = [];
    if (userID) {
        users = [userID];
    } else {
        users = yield mongoose.model('StudyExercise').distinct('userID');
    }
    for (let i = 0; i < users.length; i++) {
        if (!users[i]) {
            continue;
        }
        let stat = new (mongoose.model('StudentStat'))();
        stat.userID = users[i];
        stat.questions = yield count(users[i]);
        yield stat.save();
        if (users.length == 1) {
            return stat;
        }
    }
    function* count(userID) {
        let res = yield [
            mongoose.model('StudyExercise').count({userID: userID, status: 'finished', point: 100}),
            mongoose.model('StudyExercise').count({userID: userID, status: 'finished', point: {$gte: 85, $lt: 100}}),
            mongoose.model('StudyExercise').count({userID: userID, status: 'finished', point: {$gte: 60, $lt: 85}}),
            mongoose.model('StudyExercise').count({userID: userID, status: 'finished', point: {$lt: 60}})
        ];
        return {
            total: res[0] + res[1] + res[2] + res[3],
            perfect: res[0],
            excellent: res[1],
            pass: res[2],
            fail: res[3]
        }
    }
});

RecentSchema.index({updatedAt: -1});

mongoose.model('UserS', UserSSchema, 'users');
mongoose.model('MsgS', MsgSSchema, 'msgs');
mongoose.model('UserSSSO', UserSSSOSchema, 'userssso');
mongoose.model('StudentTarget', StudentTargetSchema, 's_target');
mongoose.model('StudentRecent', RecentSchema, 'studentRecent');
mongoose.model('StudentStat', StudentStatSchema, 'stat_s');
