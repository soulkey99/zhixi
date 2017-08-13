/**
 * Created by MengLei on 2016-09-22.
 */
"use strict";
const mongoose = require('mongoose');
const byConn = require('./../index').byConn;
const Schema = mongoose.Schema;
const BaseModel = require('./../baseModel');

let ClassHomeworkSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},     //作业ID
    school_id: {type: Schema.Types.ObjectId, required: true},   //学校ID
    class_id: {type: Schema.Types.ObjectId, required: true},    //班级ID
    t_id: {type: Schema.Types.ObjectId, required: true},    //教师ID
    schedule_id: {type: Schema.Types.ObjectId, required: true},     //课时ID
    endAt: {type: Date, required: true},        //提交截止时间
    waiting_num: {type: Number, default: 0},    //待批改数量
    questions: {type: [Schema.Types.ObjectId], default: []},    //作业题目ID
}, {timestamps: 1, id: false, read: 'sp'});

let StepSchema = new Schema({
    q_id: {type: Schema.Types.ObjectId},
    type: {type: String},
    choice_id: {type: Schema.Types.ObjectId},
    t: {type: Date}
}, {_id: false});

let QuestionSchema = new Schema({
    q_id: {type: Schema.Types.ObjectId, required: true},
    status: {type: String, default: 'pending', enum: ['pending', 'finished']},  //本道题目的状态，未完成、完成
    point: {type: Number, default: 0},
    step: {type: [StepSchema], default: []},
    startAt: {type: Date},
    endAt: {type: Date}
}, {_id: false});

let StudentHomeworkSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    class_id: {type: Schema.Types.ObjectId, required: true},
    schedule_id: {type: Schema.Types.ObjectId, required: true},
    s_id: {type: Schema.Types.ObjectId, required: true},
    avatar: {type: String, default: ''},
    endAt: {type: Date, required: true},
    is_new: {type: Boolean, default: true}, //是否新作业
    needCheck: {type: Boolean, default: false},     //是否需要家长签字
    type: {type: String, default: 'schedule', enum: ['schedule', 'additional']},   //作业类型，课时作业，补充作业
    status: {
        type: String,
        default: 'pending',
        enum: ['finished', 'pending', 'submitted', 'confirmed', 'checked', 'timeout', 'timeoutFinished']
    }, //进行中、已提交、已签字、已批改、已超时、超时后完成
    submitAt: {type: Date}, //提交时间
    confirmAt: {type: Date},    //签字时间
    confirmMsg: {type: String, default: ''},    //家长签字后留言
    checkAt: {type: Date},      //批改时间
    checkMsg: {type: String, default: ''},      //教师批改后留言
    questions: {type: [QuestionSchema], default: []},  //答题列表
}, {timestamps: 1, id: false, read: 'sp'});

let WrongQuestionSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    q_id: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, enum: ['homework', 'exercise'], default: 'exercise'},
    sec_id: {type: Schema.Types.ObjectId},
    cha_id: {type: Schema.Types.ObjectId},
    ver_id: {type: Schema.Types.ObjectId},
    e_id: {type: Schema.Types.ObjectId},
    swork_id: {type: Schema.Types.ObjectId},    //作业，对应学生作业ID
    schedule_id: {type: Schema.Types.ObjectId},
    class_id: {type: Schema.Types.ObjectId},
    reviewed: {type: Boolean, default: false},   //是否已经复习过
    grade: {type: String, default: ''},  //年级
    subject: {type: String, default: ''},  //学科
    version: {type: String, default: ''},   //教材版本
    point: {type: Number, default: 0}
}, {timestamps: 1, id: false, read: 'sp'});

let HomeworkFeedback = new Schema({
    _id: {type: Schema.Types.ObjectId},
    schedule_id: {type: Schema.Types.ObjectId, required: true},
    class_id: {type: Schema.Types.ObjectId, required: true},
    s_id: {type: Schema.Types.ObjectId, required: true},
    t_id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, default: ''}
}, {timestamps: 1, read: 'sp'});

let FeedbackTemplateSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'public', enum: ['public', 'personal']},
    userID: {type: Schema.Types.ObjectId},   //type=personal时才有
    level: {type: Number, default: 4},    //等级，1：不及格，2：及格，3：良好，4：优秀
    level_desc: {type: String, default: '优秀'},  //等级的描述
    content: {type: String, default: ''}   //内容
}, {timestamps: 1, read: 'sp'});

ClassHomeworkSchema.plugin(BaseModel);
StudentHomeworkSchema.plugin(BaseModel);
WrongQuestionSchema.plugin(BaseModel);
HomeworkFeedback.plugin(BaseModel);
FeedbackTemplateSchema.plugin(BaseModel);

ClassHomeworkSchema.virtual('homework_id').get(function () {
    return this._id.toString();
});
StudentHomeworkSchema.virtual('swork_id').get(function () {
    return this._id.toString();
});
WrongQuestionSchema.virtual('wq_id').get(function () {
    return this._id.toString();
});
HomeworkFeedback.virtual('feedback_id').get(function () {
    return this._id.toString();
});
FeedbackTemplateSchema.virtual('ft_id').get(function () {
    return this._id.toString();
});

ClassHomeworkSchema.method('toClassInfo', function *() {
    let res = yield [
        mongoose.model('Class').findById(this.class_id),
        mongoose.model('ClassSchedule').findById(this.schedule_id)
    ];
    return {
        schedule_id: this.schedule_id,
        class_id: this.class_id,
        class_name: res[0].name,
        startAt: res[1].startAt,
        endAt: res[1].endAt,
        plan: res[1].plan,
        homework_status: res[1].homework_status,
        homework_id: this._id,
        homework_endAt: this.endAt,
        waiting_num: this.waiting_num
    }
});

StudentHomeworkSchema.method('toItem', function *() {
    let c = yield mongoose.model('Class').findById(this.class_id);
    let schedule = yield mongoose.model('ClassSchedule').findById(this.schedule_id);
    let finished = 0;
    for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].status == 'finished') {
            finished++;
        }
    }
    return {
        swork_id: this._id.toString(),
        class_id: this.class_id,
        schedule_id: this.schedule_id,
        homework_id: this.homework_id,
        type: this.type,
        avatar: this.avatar,
        needCheck: this.needCheck,
        status: this.status,
        class_name: c.name,
        grade: c.grade,
        version: c.version,
        subject: c.subject,
        homework_desc: schedule.homework_desc || `第${schedule.seq}节课的作业。`,
        seq: schedule.seq,
        plan: c.plan,
        total: this.questions.length,
        finished: finished,
        is_new: this.is_new,
        endAt: this.endAt,
        createdAt: this.createdAt
    }
});
StudentHomeworkSchema.method('toStudentInfo', function *() {
    let stu = yield mongoose.model('UserS').findById(this.s_id);
    let finished = 0;
    for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].status == 'finished') {
            finished++;
        }
    }
    return {
        swork_id: this.swork_id,
        s_id: this.s_id,
        s_nick: stu.nick,
        s_name: stu.name,
        s_avatar: stu.avatar,
        status: this.status,
        total: this.questions.length,
        finished: finished,
        type: this.type,
        createdAt: this.createdAt
    }
});
ClassHomeworkSchema.method('toQuestionList', function *() {
    let qs = yield byConn.model('StudyQuestion').find({_id: {$in: this.questions}});
    return qs.map(q=> {
        let item = q.toObject({getters: true});
        delete(item._id);  //删掉没用的字段
        delete(item.id);
        delete(item.msg);
        delete(item.status);
        delete(item.userID);
        delete(item.createAt);
        delete(item.updateAt);
        delete(item.__v);
        return item;
    });
});
StudentHomeworkSchema.method('toQuestionList', function *(s_id) {
    let ids = this.questions.map(i=>i.q_id);
    let qs = yield byConn.model('StudyQuestion').find({_id: {$in: ids}});
    return this.questions.map(q=> {
        let item = {
            q_id: q.q_id,
            step: q.status == 'finished' ? q.step : [],
            status: q.status,
            point: q.status == 'finished' ? q.point : 0,
            info: {}
        };
        for (let i = 0; i < qs.length; i++) {
            if (item.q_id.toString() == qs[i].q_id.toString()) {
                item.info = qs[i].toObject({getters: true});
                delete(item.info._id);  //删掉没用的字段
                delete(item.info.id);
                delete(item.info.msg);
                delete(item.info.status);
                delete(item.info.userID);
                delete(item.info.createAt);
                delete(item.info.updateAt);
                delete(item.info.__v);
            }
        }
        return item;
    });
});
/**
 * param = {class_id: '', s_id: '', type: '', endAt: '', questions: []}
 */
StudentHomeworkSchema.static('doPublish', function *(param) {
    let studentHomework = new (mongoose.model('StudentHomework'))();
    studentHomework.class_id = param.class_id;
    studentHomework.schedule_id = param.schedule_id;
    if (param.type) {
        studentHomework.type = param.type;
    }
    studentHomework.s_id = param.s_id;
    if (param.endAt) { //提交截止日期，如果没有就默认设置为第二天
        studentHomework.endAt = param.endAt;
    } else {
        let t = new Date();
        t.setDate(t.getDate() + 1);
        t.setHours(23, 59, 59, 999);
        studentHomework.endAt = t;
    }
    studentHomework.questions = param.questions;
    return yield studentHomework.save();
});

/**
 * param = {userID: '', q_id: '', point: '', type: 'exercise/homework', sec_id: '', e_id: '', swork_id: ''}
 */
WrongQuestionSchema.static('addWrongQuestion', function *(param) {
    if (param.point >= 100) { //100分的不是错题，不添加
        return;
    }
    let q = yield byConn.model('StudyQuestion').findById(param.q_id);
    if (!q) {
        return;
    }
    if (q.type != 'root') {
        param.q_id = q.root_id;
    }
    let query = {userID: param.userID, q_id: param.q_id};
    let setObj = {
        point: param.point,
        type: param.type,
        reviewed: false
    };
    let unsetObj = {};
    switch (param.type) {
        case 'exercise': {
            let chapter = yield byConn.model('StudyChapter').findOne({sections: param.sec_id});
            let version = yield byConn.model('StudyVersion').findById(chapter.ver_id);
            setObj['sec_id'] = param.sec_id;
            setObj['cha_id'] = chapter.cha_id;
            setObj['ver_id'] = chapter.ver_id;
            setObj['e_id'] = param.e_id;
            setObj['grade'] = version.grade;
            setObj['subject'] = version.subject;
            setObj['version'] = version.version;
            unsetObj['swork_id'] = 1;
            unsetObj['schedule_id'] = 1;
            unsetObj['class_id'] = 1;
        }
            break;
        case 'homework': {
            let swork = yield mongoose.model('StudentHomework').findById(param.swork_id);
            let c = yield mongoose.model('Class').findById(swork.class_id);
            setObj['swork_id'] = param.swork_id;
            setObj['schedule_id'] = swork.schedule_id;
            setObj['class_id'] = swork.class_id;
            setObj['grade'] = c.grade;
            setObj['subject'] = c.subject;
            setObj['version'] = c.version;
            unsetObj['sec_id'] = 1;
            unsetObj['cha_id'] = 1;
            unsetObj['ver_id'] = 1;
            unsetObj['e_id'] = 1;
        }
            break;
    }
    return yield this.findOneAndUpdate(query, {$set: setObj, $unset: unsetObj}, {upsert: true, new: true});
});
WrongQuestionSchema.method('toListItem', function *() {
    let q = yield byConn.model('StudyQuestion').findById(this.q_id);
    return q.toObject({getters: true});
});

WrongQuestionSchema.method('toListItem', function *() {
    let q = yield byConn.model('StudyQuestion').findById(this.q_id);
    let item = {
        q_id: this.q_id,
        type: this.type,
        subject: this.subject,
        grade: this.grade,
        version: this.version,
        point: this.point,
        reviewed: this.reviewed,
        info: q.toObject({getters: true})
    };
    switch (this.type) {
        case 'exercise': {
            item['e_id'] = this.e_id;
            item['ver_id'] = this.ver_id;
            item['cha_id'] = this.cha_id;
            item['sec_id'] = this.sec_id;
        }
            break;
        case 'homework': {
            item['class_id'] = this.class_id;
            item['schedule_id'] = this.schedule_id;
            item['swork_id'] = this.swork_id;
        }
            break;
    }
    return item;
});

HomeworkFeedback.method('toInfo', function *() {
    let res = yield [mongoose.model('UserS').findById(this.s_id), mongoose.model('UserT').findById(this.t_id)];
    return {
        feedback_id: this.feedback_id,
        class_id: this.class_id,
        schedule_id: this.schedule_id,
        createdAt: this.createdAt,
        s_id: this.s_id,
        t_id: this.t_id,
        content: this.content,
        s_info: res[0].toSimpleInfo(),
        t_info: res[1].toSimpleInfo()
    }
});
FeedbackTemplateSchema.method('toItem', function *() {
    let info = {
        ft_id: this.ft_id,
        content: this.content,
        type: this.type,
        level: this.level,
        level_desc: this.level_desc
    };
    if (info.type == 'personal') {
        let t = yield mongoose.model('UserT').findById(this.userID);   //教师才有反馈模板
        info.t_info = t.toSimpleInfo();
    }
    return info;
});

StudentHomeworkSchema.index({createdAt: -1});
StudentHomeworkSchema.index({endAt: 1});
HomeworkFeedback.index({createdAt: -1});
FeedbackTemplateSchema.index({level: 1});

mongoose.model('ClassHomework', ClassHomeworkSchema, 'classHomework');
mongoose.model('StudentHomework', StudentHomeworkSchema, 'studentHomework');
mongoose.model('WrongQuestion', WrongQuestionSchema, 'studentWrongQuestion');
mongoose.model('HomeworkFeedback', HomeworkFeedback, 'homeworkFeedback');
mongoose.model('HomeworkFeedbackTemplate', FeedbackTemplateSchema, 'homeworkFeedbackTemplate');



