/**
 * Created by MengLei on 2016-09-05.
 */
"use strict";
const mongoose = require('mongoose');
const byConn = require('./../index').byConn;
const Schema = mongoose.Schema;
const BaseModel = require('./../baseModel');

let SchoolSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},     //学校ID
    name: {type: String, default: ''},   //校名
    province: {type: String, default: ''},  //省份
    city: {type: String, default: ''},      //城市
    type: {type: String, enum: ['primary', 'middle', 'senior', 'after', 'default'], default: 'default'},//学校类型，小学，初中，高中，课后班
    valid: {type: Boolean, default: true},
    master_id: {type: Schema.Types.ObjectId, required: true},   //管理员(校长)userID（teacher类型）
    master_passwd: {type: String, default: ''},   //管理员密码
    master_name: {type: String, default: ''},    //管理员姓名
    master_id_num: {type: String, default: ''},  //管理员身份证
    master_email: {type: String, default: ''},      //管理员电子邮箱
    master_qq: {type: String, default: ''},         //管理员qq号
    master_weixin: {type: String, default: ''},     //管理员微信号
    remark: {type: String, default: ''},    //备注
    status: {type: String, enum: ['pending', 'verified', 'fail', 'default'], default: 'default'},  //机构审核状态，审核中，通过，失败，初始状态
    id_front: {type: String, default: ''},  //管理员身份证正面
    id_back: {type: String, default: ''},   //管理员身份证背面
    id_num: {type: String, default: ''},    //管理员身份证号
    org_name: {type: String, default: ''},  //机构名称
    org_license: {type: String, default: ''},   //机构营业执照
    admin_proof: {type: String, default: ''},   //管理员在职证明
    org_num: {type: String, default: ''},       //机构代码
    org_capital: {type: Number, default: 0},    //注册资本（万元）
    org_people_num: {type: String, default: ''} //人数范围
}, {timestamps: 1, read: 'sp'});

let ClassSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    name: {type: String, required: true},
    school_id: {type: Schema.Types.ObjectId, required: true},
    t_id: {type: Schema.Types.ObjectId, required: true},
    grade: {type: String, required: true},
    valid: {type: Boolean, default: true},
    subject: {type: String, required: true},
    version: {type: String, required: true},
    class_num: {type: Number, required: true},
    duration: {type: Number, default: 60},  //持续时长，单位：分钟
    week: {type: String, enum: ['every', 'double']},
    week_num: {type: [String], default: []},
    noon: {type: String, enum: ['before', 'after'], default: 'before'},
    hour: {type: Number, enum: ['8', '9', '10', '11', '12', '0', '1', '2', '3', '4', '5', '6', '7'], default: 8},
    minute: {type: Number, default: 0},
    startAt: {type: Date, required: true, get: getDate},  //开班日期
    endAt: {type: Date, get: getDate},    //结班日期，按照新更改的需求，这个参数去掉
}, {timestamps: 1, id: false, read: 'sp'});

function getDate(val) {
    if (!val) return '';
    return val.getFullYear() + "/" + (val.getMonth() + 1) + "/" + val.getDate();
}

let ClassScheduleSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    school_id: {type: Schema.Types.ObjectId, required: true},
    class_id: {type: Schema.Types.ObjectId, required: true},
    t_id: {type: Schema.Types.ObjectId, required: true},
    seq: {type: Number, required: true},        //课时序号
    startAt: {type: Date, required: true},      //上课时间
    duration: {type: Number, required: true},   //持续时长
    endAt: {type: Date, required: true},        //下课时间
    plan: {type: String, default: ''},          //课时计划
    valid: {type: Boolean, default: true},      //是否可用
    homework_desc: {type: String, default: ''},     //教师针对本次作业的描述
    homework_auto: {type: Boolean, default: true}, //是否下课自动发布作业
    homework_status: {type: String, enum: ['waiting', 'assigned', 'abandoned', 'draft', 'timeout'], default: 'waiting'}, //留作业状态：未留，已留，放弃，草稿，超时
    homework_stat_id: {type: Schema.Types.ObjectId, default: null},  //作业结果ID
    homework_endAt: {type: Date},
    homework_waiting_num: {type: Number, default: 0},
    homework_checked: {type: Boolean, default: false},      //教师是否审过作业
    questions: {type: [Schema.Types.ObjectId], default: []},
}, {timestamps: 1, read: 'sp'});

let QuestionStatSchema = new Schema({
    q_id: {type: Schema.Types.ObjectId, required: true},
    wrong_count: {type: Number, default: 0},
    correct_count: {type: Number, default: 0}
}, {_id: false});
let StudentStatSchema = new Schema({
    s_id: {type: Schema.Types.ObjectId, required: true},
    status: {type: String, default: 'finished'},
    correct_count: {type: Number, default: 0},
    wrong_count: {type: Number, default: 0}
}, {_id: false});
let ClassScheduleStatSchema = new Schema({  //课时作业的数据统计情况记录，离线计算的，非实时
    _id: {type: Schema.Types.ObjectId},
    class_id: {type: Schema.Types.ObjectId, required: true},
    schedule_id: {type: Schema.Types.ObjectId, required: true},
    student_total: {type: Number, default: 0},
    student_finished: {type: Number, default: 0},
    unfinished_students: {type: [Schema.Types.ObjectId], default: []},
    question_stat: {type: [QuestionStatSchema], default: []},    //问题数据统计，截止之后就不再变化
    question_stat2: {type: [QuestionStatSchema], default: []},   //持续的问题数据统计，截止时间之后仍然进行计算
    student_stat: {type: [StudentStatSchema], default: []}
}, {timestamps: 1, read: 'sp', id: false});

let SchoolClassSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    school_id: {type: Schema.Types.ObjectId, required: true},
    class_id: {type: Schema.Types.ObjectId, required: true},
    valid: {type: Boolean, default: true}
}, {timestamps: 1, read: 'sp'});

let ClassStudentSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    school_id: {type: Schema.Types.ObjectId, required: true},
    class_id: {type: Schema.Types.ObjectId, required: true},
    s_id: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, enum: ['add', 'apply'], default: 'apply'}, //add：教师主动加入，apply学生申请加入
    msg: {type: String, default: ''},       //学生加入班级时留言
    reason: {type: String, default: ''},     //教师拒绝学生的理由
    status: {type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending'},
    valid: {type: Boolean, default: true}
}, {timestamps: 1, read: 'sp'});

SchoolSchema.plugin(BaseModel);
ClassSchema.plugin(BaseModel);
ClassSchema.index({class_num: 1});
SchoolClassSchema.plugin(BaseModel);
ClassStudentSchema.plugin(BaseModel);
ClassScheduleSchema.plugin(BaseModel);
ClassScheduleStatSchema.plugin(BaseModel);

SchoolSchema.virtual('school_id').get(function () {
    return this._id.toString();
});
ClassSchema.virtual('class_id').get(function () {
    return this._id.toString();
});
SchoolClassSchema.virtual('sc_id').get(function () { //school&class id
    return this._id.toString();
});
ClassStudentSchema.virtual('cs_id').get(function () {   //class&student id
    return this._id.toString();
});
ClassScheduleSchema.virtual('schedule_id').get(function () {
    return this._id.toString();
});
ClassScheduleStatSchema.virtual('homework_stat_id').get(function () {
    return this._id.toString();
});

ClassSchema.method('toStudentInfo', function *(s_id) {
    let res = yield [
        mongoose.model('School').findById(this.school_id),  //学校记录
        mongoose.model('ClassStudent').count({class_id: this.class_id, status: 'verified', valid: true}),   //人数记录
        mongoose.model('UserT').findById(this.t_id),    //教师记录
        mongoose.model('ClassStudent').findOne({class_id: this.class_id, s_id: s_id, valid: true})  //该用户是否加入班级
    ];
    return {
        class_id: this.class_id.toString(),
        class_name: this.name,
        class_num: this.class_num,
        grade: this.grade,
        subject: this.subject,
        version: this.version,
        t_id: this.t_id.toString(),
        t_name: res[2].name,
        school_id: this.school_id,
        school_name: res[0].name,
        status: res[3] ? res[3].status : '',
        startAt: this.startAt,
        endAt: this.endAt,
        duration: this.duration,
        week: this.week,
        week_num: this.week_num,
        noon: this.noon,
        hour: this.hour,
        minute: this.minute,
        s_count: res[1]
    }
});

ClassSchema.method('toTeacherDetail', function *() {
    let res = yield [
        mongoose.model('School').findById(this.school_id),  //学校记录
        mongoose.model('ClassStudent').count({class_id: this.class_id, status: 'verified', valid: true}),   //人数记录
        mongoose.model('ClassStudent').count({class_id: this.class_id, status: 'pending', type: 'apply', valid: true}),   //申请中人数
    ];
    //通过班级id查学生id
    let scs = yield mongoose.model('ClassStudent').find({
        class_id: this.class_id,
        status: 'verified',
        valid: true
    }).limit(5);
    let s_ids = scs.map(i => i.s_id);
    //通过学生id查学生头像
    let stus = yield mongoose.model('UserS').find({_id: {$in: s_ids}}, {avatar: 1});
    return {
        class_id: this.class_id.toString(),
        class_name: this.name,      //班级名称
        class_num: this.class_num,  //班号
        version: this.version,
        grade: this.grade,
        subject: this.subject,
        t_id: this.t_id.toString(), //教师ID
        school_id: this.school_id,  //学校ID
        school_name: res[0].name,   //学校名称
        avatars: stus.map(i => i.avatar), //返回5个学生头像
        duration: this.duration,
        week: this.week,
        week_num: this.week_num,
        noon: this.noon,
        hour: this.hour,
        minute: this.minute,
        startAt: this.startAt,  //开始时间
        endAt: this.endAt,      //截止时间
        s_count: res[1],        //学生人数
        s_pending_count: res[2],    //申请中学生人数
    }
});

ClassSchema.method('toListInfo', function *() {
    let item = {
        class_id: this.class_id,
        class_name: this.name,
        subject: this.subject,
        grade: this.grade,
        version: this.version,
        school_id: this.school_id,
        t_id: this.t_id,
        week: this.week,
        startAt: this.startAt,
        endAt: this.endAt,
        minute: this.minute,
        hour: this.hour,
        noon: this.noon,
        week_num: this.week_num,
        duration: this.duration,
        valid: this.valid,
        s_count: 0,
        createdAt: this.createdAt
    };
    item.s_count = yield mongoose.model('ClassStudent').count({
        class_id: item.class_id,
        status: 'verified',
        valid: true
    });
    return item;
});

/**
 * 生成todo，指定日期或者指定时间段内，优先指定时间点
 * @param {Object} param = {start: '', end: '', date: ''}
 */
ClassSchema.method('genTodo', function *(param) {
    if (!this.valid) {
        return;
    }
    let t0 = new Date(this.startAt);  //开课时间
    let t1 = new Date();   //时间段开始点
    let t2 = new Date();   //时间段结束点
    let t = new Date();   //指定时间点
    if (param.date) {
        t = new Date(param.date);
        t.setHours(0, 0, 0, 0);
        if (this.endAt && this.endAt < t) {
            return;
        }
        if (this.week == 'double' && (Math.floor(t - t0) / 86400 / 7 / 1000) % 2 == 1) {
            return;   //双周排课情况特殊处理
        }
        if (this.week_num.indexOf(t.getDay().toString()) >= 0) {//满足星期要求，增加一条todo记录
            let time = new Date(t);
            time.setHours(this.hour + (this.noon == 'after' ? 12 : 0), this.minute);
            let todo = yield mongoose.model('Todo').findOne({class_id: this.class_id, startAt: time});
            if (todo) { //如果这个时间的数据已经存在，就不必生成了
                return;
            }
            todo = new (mongoose.model('Todo'))();
            todo.userID = this.t_id;
            todo.type = 'schedule';
            todo.class_id = this.class_id;
            todo.school_id = this.school_id;
            todo.startAt = time;
            todo.endAt = new Date(todo.startAt.getTime() + this.duration * 60 * 1000);
            yield todo.save();
        }
    } else {
        t1 = new Date(param.start);
        t2 = new Date(param.end);
        t1.setHours(0, 0, 0, 0);
        t2.setHours(23, 59, 59, 999);
        for (; t1 < t2; t1.setDate(t1.getDate() + 1)) {
            if (this.endAt && new Date(this.endAt) < t1) {
                return;
            }
            if (this.week == 'double' && Math.floor((t1 - t0) / 86400 / 7 / 1000) % 2 == 1) {
                continue;   //对于双周排课的情况要特殊处理
            }
            if (this.week_num.indexOf(t1.getDay().toString()) >= 0) {
                let time = new Date(t1);
                time.setHours(this.hour + (this.noon == 'after' ? 12 : 0), this.minute);
                let todo = yield mongoose.model('Todo').findOne({class_id: this.class_id, startAt: time});
                if (todo) { //如果这个时间的数据已经存在，就不必生成了
                    return;
                }
                todo = new (mongoose.model('Todo'))();
                todo.userID = this.t_id;
                todo.type = 'schedule';
                todo.class_id = this.class_id;
                todo.school_id = this.school_id;
                todo.startAt = time;
                todo.endAt = new Date(todo.startAt.getTime() + this.duration * 60 * 1000);
                yield todo.save();
            }
        }
    }
});

ClassScheduleSchema.method('toClassInfo', function *() {    //为课时计划加上班级信息
    let c = yield mongoose.model('Class').findById(this.class_id);
    return {
        schedule_id: this._id.toString(),
        seq: this.seq,
        class_id: this.class_id,
        class_name: c.name,
        startAt: this.startAt,
        endAt: this.endAt,
        plan: this.plan,
        homework_status: this.homework_status,
        homework_endAt: this.homework_endAt || '',
        homework_waiting_num: this.homework_waiting_num
    }
});

ClassScheduleSchema.method('toClassDetail', function *() {  //为课时计划加上班级详情
    let c = yield mongoose.model('Class').findById(this.class_id);
    return {
        schedule_id: this._id.toString(),
        seq: this.seq,
        class_id: this.class_id,
        class_name: c.name,
        startAt: this.startAt,
        endAt: this.endAt,
        plan: this.plan,
        grade: c.grade,
        subject: c.subject,
        version: c.version,
        questions: this.questions,
        homework_status: this.homework_status,
        homework_endAt: this.homework_endAt || '',
        homework_waiting_num: this.homework_waiting_num
    }
});

ClassScheduleSchema.method('toQuestionList', function *() {
    let qs = yield byConn.model('StudyQuestion').find({_id: {$in: this.questions}});
    return qs.map(q => {
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

ClassScheduleSchema.method('publish', function *() {   //发布指定课时的作业
    let classStudent = yield mongoose.model('ClassStudent').find({
        class_id: this.class_id,
        valid: true,
        status: 'verified'
    });
    for (let i = 0; i < classStudent.length; i++) {
        yield mongoose.model('StudentHomework').doPublish({
            class_id: this.class_id,
            schedule_id: this.schedule_id,
            type: 'schedule',
            s_id: classStudent[i].s_id,
            endAt: this.homework_endAt,
            questions: this.questions.map(i => {
                return {q_id: i};
            })
        });
    }
    return yield mongoose.model('ClassSchedule').findByIdAndUpdate(this.schedule_id, {$set: {homework_status: 'assigned'}}, {new: true});
});

ClassScheduleSchema.method('calculate', function *() {
    let point_threshold = 100;   //题目正确与错误的分界值
    let schedule = this;
    if (this.homework_stat_id && this.homework_endAt < new Date(Date.now() + 300000)) {  //有个五分钟的buffer
        return;
    }
    let sworks = yield mongoose.model('StudentHomework').find({schedule_id: this.schedule_id, type: 'schedule'});
    let stat = yield mongoose.model('HomeworkStat').findById(this.homework_stat_id);
    if (!stat) {
        stat = new (mongoose.model('HomeworkStat'))();
        stat.schedule_id = this.schedule_id;
        stat.class_id = this.class_id;
        stat.student_total = sworks.length;
    }
    stat.question_stat = this.questions.map(q_id => ({q_id, wrong_count: 0, correct_count: 0}));
    stat.student_stat = sworks.map(swork => ({s_id: swork.s_id, wrong_count: 0, correct_count: 0}));
    stat.unfinished_students = [];
    stat.student_finished = 0;
    for (let i = 0; i < sworks.length; i++) {
        if (sworks[i].status == 'finished' || sworks[i].status == 'submitted') {
            stat.student_finished++;
        } else {
            stat.unfinished_students.push(sworks[i].s_id);
        }
        for (let j = 0; j < stat.student_stat.length; j++) {  //学生数据
            if (stat.student_stat[j].s_id.toString() == sworks[i].s_id.toString()) {
                stat.student_stat[j].status = sworks[i].status;
                for (let k = 0; k < sworks[i].questions.length; k++) {   //统计学生答题数据
                    if (sworks[i].questions[k].status == 'finished') {
                        if (sworks[i].questions[k].point < point_threshold) {
                            stat.student_stat[j].wrong_count++;
                        } else {
                            stat.student_stat[j].correct_count++;
                        }
                    }
                    for (let l = 0; l < stat.question_stat.length; l++) {  //统计题目数据
                        if (stat.question_stat[l].q_id.toString() == sworks[i].questions[k].q_id.toString()) {
                            if (sworks[i].questions[k].status == 'finished') {
                                if (sworks[i].questions[k].point < point_threshold) {
                                    stat.question_stat[l].wrong_count++;
                                } else {
                                    stat.question_stat[l].correct_count++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    stat.question_stat.sort((a, b) => b.wrong_count - a.wrong_count);
    stat.question_stat2 = stat.question_stat;
    stat.student_stat.sort((a, b) => b.wrong_count - a.wrong_count);
    yield stat.save();
    return yield mongoose.model('ClassSchedule').findByIdAndUpdate(this.schedule_id, {$set: {homework_stat_id: stat._id}});
    // return stat;
});

ClassScheduleSchema.method('calculateQuestion', function *() {
    let point_threshold = 100;   //题目正确与错误的分界值
    let schedule = this;
    if (this.homework_stat_id && this.homework_endAt > new Date()) {  //有个五分钟的buffer
        return;
    }
    let sworks = yield mongoose.model('StudentHomework').find({schedule_id: this.schedule_id, type: 'schedule'});
    let stat = yield mongoose.model('HomeworkStat').findById(this.homework_stat_id);
    stat.question_stat2 = this.questions.map(q_id => ({q_id, wrong_count: 0}));
    for (let i = 0; i < stat.question_stat2.length; i++) {
        for (let j = 0; j < sworks.length; j++) {
            for (let k = 0; k < sworks[j].questions.length; k++) {
                if (sworks[j].questions[k].status == 'finished') {
                    if (sworks[j].questions[k].point < point_threshold) {
                        stat.question_stat2[i].wrong_count++;
                    } else {
                        stat.question_stat2[i].correct_count++;
                    }
                }
            }
        }
    }
    stat.question_stat.sort((a, b) => b.wrong_count - a.wrong_count);
    yield stat.save();
});

ClassStudentSchema.method('toClassStudentInfo', function *() {
    let res = yield [
        mongoose.model('Class').findById(this.class_id),
        mongoose.model('UserS').findById(this.s_id)
    ];
    return {
        cs_id: this.cs_id,
        class_id: this.class_id,
        class_name: res[0].name,
        reason: this.reason,
        s_id: this.s_id,
        s_name: res[1].name,
        s_nick: res[1].nick,
        s_avatar: res[1].avatar,
        msg: this.msg,
        status: this.status
    }
});

ClassStudentSchema.method('toClassInfo', function *() { //添加班级信息返回
    let res = yield mongoose.model('Class').findById(this.class_id);
    return {
        cs_id: this.cs_id,
        class_id: this.class_id,
        class_name: res.name,
        msg: this.msg,
        reason: this.reason,
        status: this.status
    }
});

ClassStudentSchema.method('toStudentInfo', function *(s_id) {   //学生端展现的班级item，返回不超过5个头像
    let res = yield [
        mongoose.model('Class').findById(this.class_id),    //班级记录
        mongoose.model('School').findById(this.school_id),  //学校记录
        mongoose.model('UserS').findById(this.s_id),        //学生记录
        mongoose.model('ClassStudent').count({class_id: this.class_id, status: 'verified', valid: true})
    ];
    res[4] = yield mongoose.model('UserT').findById(res[0].t_id);   //教师记录
    //通过班级id查学生id
    let scs = yield mongoose.model('ClassStudent').find({
        class_id: this.class_id,
        status: 'verified',
        valid: true
    }).limit(5);
    let s_ids = scs.map(i => i.s_id);
    //通过学生id查学生头像
    let stus = yield mongoose.model('UserS').find({_id: {$in: s_ids}}, {avatar: 1});
    return {
        class_id: this.class_id.toString(),
        class_name: res[0].name,
        class_num: res[0].class_num,
        t_id: res[0].t_id,
        t_name: res[4].name,
        school_id: res[1].school_id,
        school_name: res[1].name,
        status: this.status,
        startAt: res[0].startAt,
        endAt: res[0].endAt,
        avatars: stus.map(i => i.avatar),
        s_count: res[3]
    }
});

/**
 * 计算指定课时的作业统计数据，传 schedule_id
 */
ClassScheduleStatSchema.static('calculate', function *(schedule_id) {
    let schedule = yield mongoose.model('ClassSchedule').findById(schedule_id);
    schedule = yield schedule.calculate();
    return yield mongoose.model('HomeworkStat').findById(schedule.homework_stat_id);
});
ClassScheduleStatSchema.static('calculateQuestion', function *(schedule_id) {
    let schedule = yield mongoose.model('ClassSchedule').findById(schedule_id);
    yield schedule.calculateQuestion();
});

ClassScheduleStatSchema.method('toInfo', function *() {
    let obj = this.toObject();
    let unfinished_s = yield mongoose.model('UserS').find({_id: {$in: obj.unfinished_students.slice(0, 5)}});
    let additional_sworks = yield mongoose.model('StudentHomework').find({
        schedule_id: this.schedule_id,
        type: 'additional'
    });
    let additional_s = yield mongoose.model('UserS').find({_id: {$in: additional_sworks.map(i => i.s_id)}});
    let schedule = yield mongoose.model('ClassSchedule').findById(this.schedule_id);
    let c = yield mongoose.model('Class').findById(this.class_id);
    let item = {
        homework_stat_id: this.homework_stat_id,
        class_id: this.class_id,
        schedule_startAt: schedule.startAt,
        class_name: c.name,
        avatar: c.avatar,
        schedule_id: this.schedule_id,
        seq: schedule.seq,
        student_total: this.student_total,
        student_finished: this.student_finished,
        question_total: obj.question_stat.length,
        unfinished_students: unfinished_s.map(i => ({
            s_id: i.userID,
            s_nick: i.nick,
            s_avatar: i.avatar,
            s_name: i.name
        })),
        additional_students: additional_s.map(i => ({
            s_id: i.userID,
            s_nick: i.nick,
            s_avatar: i.avatar,
            s_name: i.name
        })),
        status: 'finished',
        question_stat: [],
        student_stat: []
    };
    obj.question_stat = obj.question_stat2 && obj.question_stat2.length > 0 ? obj.question_stat2 : obj.question_stat;
    obj.question_stat.sort((a, b) => b.wrong_count - a.wrong_count);
    obj.student_stat.sort((a, b) => b.wrong_count - a.wrong_count);
    for (let i = 0; i < Math.min(obj.question_stat.length, 5); i++) {
        if (obj.question_stat[i].wrong_count > 0) {
            item.question_stat.push({
                q_id: obj.question_stat[i].q_id,
                wrong_count: obj.question_stat[i].wrong_count,
                correct_count: obj.question_stat[i].correct_count
            });
        }
    }
    for (let i = 0; i < Math.min(obj.student_stat.length, 6); i++) {
        let s_item = {
            s_id: obj.student_stat[i].s_id,
            s_nick: '',
            s_avatar: '',
            s_name: '',
            wrong_count: obj.student_stat[i].wrong_count,
            correct_count: obj.student_stat[i].correct_count,
            status: obj.student_stat[i].status
        };
        let stu = yield mongoose.model('UserS').findById(s_item.s_id);
        s_item.s_nick = stu.nick;
        s_item.s_avatar = stu.avatar;
        s_item.s_name = stu.name;
        item.student_stat.push(s_item);
    }
    return item;
});

ClassScheduleStatSchema.method('toStudentList', function *() {
    let list = [];
    for (let i = 0; i < this.student_stat.length; i++) {
        let stu = yield mongoose.model('UserS').findById(this.student_stat[i].s_id);
        list.push({
            s_id: this.student_stat[i].s_id,
            status: this.student_stat[i].status,
            s_nick: stu.nick,
            s_name: stu.name,
            s_avatar: stu.avatar,
            wrong_count: this.student_stat[i].wrong_count,
            correct_count: this.student_stat[i].correct_count,
            question_total: this.question_stat.length
        });
    }
    return list;
});

ClassScheduleStatSchema.method('toWrongQuestionList', function *() {    //错题列表
    let list = [];
    for (let i = 0; i < this.question_stat.length; i++) {
        if (this.question_stat[i].wrong_count > 0) {
            let q = yield byConn.model('StudyQuestion').findById(this.question_stat[i].q_id);
            list.push({
                q_id: this.question_stat[i].q_id,
                info: q.toItem(),
                wrong_count: this.question_stat[i].wrong_count
            });
        }
    }
    list.sort((a, b) => b.wrong_count - a.wrong_count);
    return list;
});


mongoose.model('School', SchoolSchema, 'school');
mongoose.model('Class', ClassSchema, 'class');
mongoose.model('SchoolClass', SchoolClassSchema, 'schoolClass');
mongoose.model('ClassSchedule', ClassScheduleSchema, 'classSchedule');
mongoose.model('ClassStudent', ClassStudentSchema, 'classStudent');
mongoose.model('HomeworkStat', ClassScheduleStatSchema, 'classScheduleHomeworkStat');

